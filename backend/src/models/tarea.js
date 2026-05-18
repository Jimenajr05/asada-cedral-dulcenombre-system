/**
 * @file tarea.js
 * @description Esquema de Mongoose para la agenda interna de tareas pendientes de los administradores.
 */

const mongoose = require("mongoose");

/**
 * Esquema de Mongoose para Tarea (To-Do List administrativa).
 * @typedef {Object} Tarea
 * @property {string} texto - Descripción de la tarea (obligatorio).
 * @property {"alta"|"media"|"baja"} prioridad - Nivel de urgencia.
 * @property {boolean} completada - Estado de resolución de la tarea.
 * @property {mongoose.Types.ObjectId} creadoPor - ID del administrador creador.
 */
const tareaSchema = new mongoose.Schema(
  {
    texto: {
      type: String,
      required: true,
      trim: true,
    },
    prioridad: {
      type: String,
      enum: ["alta", "media", "baja"],
      default: "media",
    },
    completada: {
      type: Boolean,
      default: false,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tarea", tareaSchema);