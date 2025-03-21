export interface DrivingData {
    driverId: string;
    acceleration: number;
    braking: number;
    turn: number;
    timestamp: string;
  }
  
  export interface DrivingResult extends DrivingData {
    isFlagged: boolean;
    sustainabilityScore: number;
  }
  