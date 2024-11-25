// controllers/reporteController.js
const Pedido = require("../models/Pedido");
const Sushi = require("../models/Sushi");

// Controlador para obtener el reporte de ventas por tipo de sushi
const reporteVentasPorMes = async (req, res) => {
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

const obtenerVetasShushoPorMes = async (req, res) => {
  try {
    const { ano, mes } = req.query;

    if (!ano || !mes) {
      return res
        .status(400)
        .json({ error: "Se requiere año y mes en la consulta" });
    }

    // Determinar el rango de fechas del mes
    const startDate = new Date(ano, mes - 1, 1); // Primer día del mes
    const endDate = new Date(ano, mes, 0, 23, 59, 59, 999); // Último día del mes

    // Buscar pedidos en el rango de fechas especificado
    const pedidos = await Pedido.find({
      fecha: { $gte: startDate, $lte: endDate },
    }).populate("sushis.sushi"); // Obtener detalles del sushi

    // Calcular las ventas totales por tipo de sushi
    const salesData = {};

    pedidos.forEach((pedido) => {
      pedido.sushis.forEach(({ sushi, cantidad }) => {
        if (!salesData[sushi._id]) {
          salesData[sushi._id] = {
            _id: sushi._id,
            tipoSushi: sushi.nombre,
            cantidadVendida: 0,
            totalVentas: 0,
          };
        }

        salesData[sushi._id].cantidadVendida += cantidad;
        salesData[sushi._id].totalVentas += cantidad * sushi.precio; // Calcular el total por sushi
      });
    });

    // Convertir los datos en un arreglo
    const result = Object.values(salesData);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener las ventas por mes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const cantidadVentasPorSushi = async (req, res) => {
  const { ano } = req.query; // Año como parámetro de consulta

  try {
    // Definir el inicio y fin del año
    const fechaInicio = new Date(`${ano}-01-01`); // 1 de enero del año
    const fechaFin = new Date(`${parseInt(ano) + 1}-01-01`); // 1 de enero del siguiente año

    // Realizar la agregación de los pedidos y calcular la cantidad de ventas por tipo de sushi durante el año
    const reporteCantidadSushi = await Pedido.aggregate([
      {
        $match: {
          fecha: { $gte: fechaInicio, $lt: fechaFin }, // Filtrar por el año solicitado
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

const reporteVentasTotalesPorMes = async (req, res) => {
  const { ano } = req.query; // Obtener el año de consulta

  if (!ano) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar el año (ano) como parámetro." });
  }

  try {
    // Crear una lista de todos los meses
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    // Realizar la agregación de los pedidos para el año solicitado
    const reporte = await Pedido.aggregate([
      {
        $match: {
          fecha: {
            $gte: new Date(`${ano}-01-01T00:00:00.000Z`), // Inicio del año
            $lt: new Date(`${parseInt(ano) + 1}-01-01T00:00:00.000Z`), // Fin del año
          },
        },
      },
      {
        $group: {
          _id: { mes: { $month: "$fecha" } }, // Agrupar por mes
          totalVentas: { $sum: "$total" }, // Sumar las ventas totales
        },
      },
      {
        $project: {
          mes: "$_id.mes",
          totalVentas: 1,
          _id: 0,
        },
      },
    ]);

    // Crear un mapa de los meses consultados
    const ventasPorMes = reporte.reduce((acc, { mes, totalVentas }) => {
      acc[mes] = totalVentas;
      return acc;
    }, {});

    // Completar los meses con ventas en 0 si no están registrados
    const mesesReporte = meses.map((nombreMes, index) => ({
      mes: nombreMes,
      totalVentas: ventasPorMes[index + 1] || 0, // Si no hay datos, usar 0
    }));

    // Formar la respuesta
    const respuesta = {
      ano: parseInt(ano),
      meses: mesesReporte,
    };

    res.json(respuesta);
  } catch (error) {
    console.error("Error al generar el reporte mensual:", error);
    res.status(500).send("Error al generar el reporte mensual");
  }
};

module.exports = {
  reporteVentasPorMes,
  obtenerVetasShushoPorMes,
  cantidadVentasPorSushi,
  reporteVentasTotalesPorMes,
};
