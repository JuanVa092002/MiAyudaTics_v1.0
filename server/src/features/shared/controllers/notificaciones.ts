import { Request, Response } from 'express';
import Notificacion from '../models/notificaciones';

export const getNotificaciones = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).usuario._id;
    const notificaciones = await Notificacion.find({ 
      usuario: userId,
      leido: false 
    }).sort({ createdAt: -1 });

    res.status(200).json(notificaciones);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const marcarComoLeida = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByIdAndUpdate(
      id,
      { leido: true },
      { new: true }
    );

    if (!notificacion) {
      res.status(404).json({ message: 'Notificación no encontrada' });
      return;
    }

    res.status(200).json(notificacion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const marcarTodasComoLeidas = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).usuario._id;
    await Notificacion.updateMany(
      { usuario: userId, leido: false },
      { leido: true }
    );

    res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


