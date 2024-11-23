// controllers/reporteController.js
const Pedido = require("../models/Pedido");
const Sushi = require("../models/Sushi");

// Controlador para obtener el reporte de ventas por tipo de sushi
const reporteVentas = async (req, res) => {
  const { mes, ano } = req.query; // Mes y año como parámetros de consulta

  try {
    // Definir el inicio y fin del mes
    const fechaInicio = new Date(`${ano}-${mes}-01`);
    const fechaFin = new Date(`${ano}-${parseInt(mes) + 1}-01`);
    fechaFin.setDate(fechaFin.getDate() - 1); // El último día del mes

    // Realizar la agregación de los pedidos
    const reporte = await Pedido.aggregate([
      {
        $match: {
          fecha: { $gte: fechaInicio, $lte: fechaFin }, // Filtrar por fecha
        },
      },
      { $unwind: "$sushis" }, // Descomponer los sushis de cada pedido
      {
        $group: {
          _id: "$sushis.sushi", // Agrupar por ID de sushi
          totalVentas: { $sum: { $multiply: ["$sushis.cantidad", "$total"] } }, // Total de ventas por tipo
          cantidadVendida: { $sum: "$sushis.cantidad" }, // Cantidad total vendida
        },
      },
      {
        $lookup: {
          from: "sushis", // Colección de sushis
          localField: "_id",
          foreignField: "_id",
          as: "sushiInfo",
        },
      },
      { $unwind: "$sushiInfo" }, // Unir la información del sushi
      {
        $project: {
          tipoSushi: "$sushiInfo.nombre", // Nombre del sushi
          totalVentas: 1,
          cantidadVendida: 1,
        },
      },
    ]);

    // Responder con los datos del reporte
    res.json(reporte);
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    res.status(500).send("Error al generar el reporte");
  }
};

const pedidosPorEstado = async (req, res) => {
  const { mes, ano } = req.query; // Mes y año como parámetros de consulta

  try {
    // Definir el inicio y fin del mes
    const fechaInicio = new Date(`${ano}-${mes}-01`);
    const fechaFin = new Date(`${ano}-${parseInt(mes) + 1}-01`);
    fechaFin.setDate(fechaFin.getDate() - 1); // El último día del mes

    // Agregar los pedidos por estado
    const reporteEstado = await Pedido.aggregate([
      {
        $match: {
          fecha: { $gte: fechaInicio, $lte: fechaFin },
        },
      },
      {
        $group: {
          _id: "$estado", // Agrupar por estado de pedido
          cantidad: { $sum: 1 }, // Contar cuántos pedidos hay en cada estado
        },
      },
    ]);

    // Responder con el reporte de pedidos por estado
    res.json(reporteEstado);
  } catch (error) {
    console.error("Error al obtener los pedidos por estado:", error);
    res.status(500).send("Error al obtener los pedidos por estado");
  }
};

const cantidadVentasPorSushi = async (req, res) => {
  const { mes, ano } = req.query; // Mes y año como parámetros de consulta

  try {
    // Definir el inicio y fin del mes
    const fechaInicio = new Date(`${ano}-${mes}-01`);
    const fechaFin = new Date(`${ano}-${parseInt(mes) + 1}-01`);
    fechaFin.setDate(fechaFin.getDate() - 1); // El último día del mes

    // Realizar la agregación de los pedidos y calcular la cantidad de ventas por tipo de sushi
    const reporteCantidadSushi = await Pedido.aggregate([
      {
        $match: {
          fecha: { $gte: fechaInicio, $lte: fechaFin },
        },
      },
      { $unwind: "$sushis" }, // Descomponer los sushis de cada pedido
      {
        $group: {
          _id: "$sushis.sushi", // Agrupar por tipo de sushi
          cantidadVendida: { $sum: "$sushis.cantidad" }, // Sumar la cantidad vendida de cada tipo de sushi
        },
      },
      {
        $lookup: {
          from: "sushis", // Colección de sushis
          localField: "_id",
          foreignField: "_id",
          as: "sushiInfo",
        },
      },
      { $unwind: "$sushiInfo" }, // Unir la información del sushi
      {
        $project: {
          tipoSushi: "$sushiInfo.nombre", // Nombre del sushi
          cantidadVendida: 1,
        },
      },
    ]);

    // Responder con el reporte de cantidad de ventas por tipo de sushi
    res.json(reporteCantidadSushi);
  } catch (error) {
    console.error(
      "Error al obtener la cantidad de ventas por tipo de sushi:",
      error
    );
    res
      .status(500)
      .send("Error al obtener la cantidad de ventas por tipo de sushi");
  }
};

module.exports = {
  reporteVentas,
  pedidosPorEstado,
  cantidadVentasPorSushi,
};
