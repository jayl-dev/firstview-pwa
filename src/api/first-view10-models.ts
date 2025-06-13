export interface NotificationDistanceResponse {
  items: NotificationDistanceItem[];
}

export interface NotificationDistanceItem {
  id: number;
  locationName?: string;
  studentId?: number;
  studentName?: string;
  routeCode?: string;
  timeFrom?: string;
  timeTo?: string;
  latitude?: number;
  longitude?: number;
  range?: number;
  type?: string;
  address?: string;
  status?: string;
  templateId?: number;
  runCode?: string;
  dispatchType?: string;
  source?: string;
  routeId?: number;
  masterTrip?: MasterTrip;
  timezone?: string;
}

export interface MasterTrip {
  taskTemplateId?: string;
  routeId?: number;
  routeKey?: string;
  tripName?: string;
  runTemplateId?: number;
  runCode?: string;
  routeCode?: string;
  dispatchType?: string;
  effectiveStartDate?: string;
  effectiveEndDate?: string;
  schedule?: string;
  runStartTime?: string;
  runEndTime?: string;
  schools?: School[];
  timezone?: string;
  districtId?: number;
}

export interface School {
  schoolId?: number;
  schoolName?: string;
  expectedArrivalTime?: string;
}

export interface RecentLocation {
  eventId: string;
  eventType: string;
  eventSource: string;
  eventTimestamp: string;
  sourceTimestamp: string;
  createdTimestamp: string;
  deviceId: string;
  vehicleId: string;
  locationId: string;
  heading: number;
  speed: number;
  odometerReading: number;
  latitude: number;
  longitude: number;
  status: Status;
  isLateEvent: boolean;
}

export interface Status {
  ignition: boolean;
  motion: boolean;
  door: boolean;
}

export interface StudentTrips {
  items: StudentTrip[];
}

export interface StudentTrip {
  id: number;
  version?: string;
  templateId?: string;
  routeKey?: string;
  routeCode?: string;
  date?: string;
  name?: string;
  status?: string;
  rawStatus?: string;
  liveTime?: string;
  completedTime?: string;
  type?: string;
  direction?: string;
  districtId?: number;
  businessUnitId?: number;
  driverName?: string;
  originDriverName?: string;
  driverFirstName?: string;
  driverMiddleName?: string;
  driverLastName?: string;
  previousDriverId?: string;
  previousDriverFirstName?: string;
  previousDriverMiddleName?: string;
  previousDriverLastName?: string;
  originDriverFirstName?: string;
  originDriverMiddleName?: string;
  originDriverLastName?: string;
  vehicleLp?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleId?: string;
  previousVehicleId?: string;
  previousVehicleLp?: string;
  previousVehicleModel?: string;
  previousVehicleColor?: string;
  originVehicleLp?: string;
  originVehicleModel?: string;
  originVehicleColor?: string;
  originVehicleId?: string;
  source?: string;
  driverId?: string;
  originDriverId?: string;
  timezone?: string;
  isChanged?: boolean;
  runs?: Run[];
  detachedRuns?: any[];
  depots?: any[];
}

export interface Run {
  id: number;
  tripId?: number;
  originTripId?: number;
  originTripName?: string;
  code?: string;
  routeCode?: string;
  dispatchType?: string;
  order?: number;
  startTime?: string;
  endTime?: string;
  runTemplateExtId?: string;
  sceOffset?: string;
  sceType?: string;
  stops?: Stop10[];
  students?: Student10[];
}

export interface Stop10 {
  id: number;
  order?: number;
  status?: string;
  addressType?: string;
  addressName?: string;
  originAddressLine?: string;
  originAddressLine2?: string;
  originAddressCity?: string;
  originAddressState?: string;
  originAddressZip?: string;
  originAddressName?: string;
  originLatitude?: number;
  originLongitude?: number;
  addressLine?: string;
  addressLine2?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  originArrivalPlanned?: string;
  arrivalPlanned?: string;
  arrivalFact?: string;
  departurePlanned?: string;
  departureFact?: string;
  latitude?: number;
  longitude?: number;
  schoolId?: number;
}

export interface Student10 {
  id: number;
  code?: string;
  name?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  source?: string;
  notes?: string;
  pickupStopId?: number;
  dropoffStopId?: number;
  specialEquipment?: string[];
  loadStatus?: string;
  loadStatusUpdateTime?: string;
  cancellationRequestStatus?: string;
  cancellationInitiatorEmail?: string;
  cancellationReason?: string;
  cancellationInitiator?: string;
  cancellationRequestStatusUpdateTime?: string;
}

export interface NotificationResponse10 {
  content?: Notification10[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface Notification10 {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  type: string;
  notificationSubType: string;
  studentId: number;
  studentName: string;
  serviceTypeName: string;
  notificationStatus: string;
  category: string;
}

export interface Pageable {
  skip: number;
  limit: number;
  sort: Sort;
  offset: number;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}
