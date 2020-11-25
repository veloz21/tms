import { TruckTable } from './trucks.table';
import { MaintenanceTable } from './maintenance.table';

// Wrapper class
export class WorkshopDataContext {
  public static trucks = TruckTable.trucks;
  public static maintenances = MaintenanceTable.maintenances;
}
