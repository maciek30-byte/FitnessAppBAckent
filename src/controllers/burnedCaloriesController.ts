import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import BurnedCalories from '../models/BurnedCaloriesSchema';

export const addBurnedCalories = [
  // Walidacja
  body('calories').isNumeric().withMessage('Calories must be a number'),
  body('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Invalid date format'),

  async (req: Request, res: Response) => {
    // Sprawdzenie błędów walidacji
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { calories, date } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ message: 'Unauthorized. User ID not found.' });
      }

      const newEntry = new BurnedCalories({
        userId,
        calories,
        date: date ? new Date(date) : new Date(),
      });

      await newEntry.save();

      res.status(201).json(newEntry);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },
];
