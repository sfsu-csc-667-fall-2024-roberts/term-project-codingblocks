import { Request, Response, NextFunction } from "express";

export const checkGameExists = async (req: Request, res: Response, next: NextFunction) => {
  const { gameId } = req.params;
  
  try {
    const game = await db.one("SELECT id FROM games WHERE id = $1", [gameId]);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify game" });
  }
};
