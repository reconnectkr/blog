export const LOCKER_STATUS_AVAILABLE = 'available';
export const LOCKER_STATUS_OCCUPIED = 'occupied';
export const LOCKER_STATUS_DISABLED = 'disabled';

export const LockerStatus = [
  LOCKER_STATUS_AVAILABLE,
  LOCKER_STATUS_OCCUPIED,
  LOCKER_STATUS_DISABLED,
] as const;

export const LOCKER_ACTION_NAME_ASSIGN = 'assign';
export const LOCKER_ACTION_NAME_RELEASE = 'release';
export const LOCKER_ACTION_NAME_DISABLE = 'disable';
export const LOCKER_ACTION_NAME_ENABLE = 'enable';
export const LockerActionName = [
  LOCKER_ACTION_NAME_ASSIGN,
  LOCKER_ACTION_NAME_RELEASE,
  LOCKER_ACTION_NAME_DISABLE,
  LOCKER_ACTION_NAME_ENABLE,
] as const;

export function getNextLockerStatus(actionName: string) {
  if (actionName === LOCKER_ACTION_NAME_ASSIGN) {
    return LOCKER_STATUS_OCCUPIED;
  } else if (actionName === LOCKER_ACTION_NAME_RELEASE) {
    return LOCKER_STATUS_AVAILABLE;
  } else if (actionName === LOCKER_ACTION_NAME_DISABLE) {
    return LOCKER_STATUS_DISABLED;
  } else if (actionName === LOCKER_ACTION_NAME_ENABLE) {
    return LOCKER_STATUS_AVAILABLE;
  }
}

export function getCurrentLockerStatus(lastActionName: string) {
  if (lastActionName === LOCKER_ACTION_NAME_ASSIGN) {
    return LOCKER_STATUS_OCCUPIED;
  } else if (lastActionName === LOCKER_ACTION_NAME_RELEASE) {
    return LOCKER_STATUS_AVAILABLE;
  } else if (lastActionName === LOCKER_ACTION_NAME_DISABLE) {
    return LOCKER_STATUS_DISABLED;
  } else if (lastActionName === LOCKER_ACTION_NAME_ENABLE) {
    return LOCKER_STATUS_AVAILABLE;
  }
  return LOCKER_STATUS_AVAILABLE;
}

export const LockerTestData = [
  {
    id: 1,
    lockerRoomId: 'A101',
    name: 'Locker 1',
    status: 'unassigned',
  },
  {
    id: 2,
    lockerRoomId: 'A101',
    name: 'Locker 2',
    status: 'assigned',
    assignment: {
      assignedAt: (() => {
        const date = new Date();
        date.setHours(9, 30, 0); // 09:30:00
        return date;
      })(),
      userId: 1001,
      reservationId: 5001,
    },
  },
  {
    id: 3,
    lockerRoomId: 'B202',
    name: 'Locker 3',
    status: 'unassigned',
  },
  {
    id: 4,
    lockerRoomId: 'B202',
    name: 'Locker 4',
    status: 'disabled',
  },
  {
    id: 5,
    lockerRoomId: 'C303',
    name: 'Locker 5',
    status: 'assigned',
    assignment: {
      assignedAt: (() => {
        const date = new Date();
        date.setHours(14, 15, 0); // 14:15:00
        return date;
      })(),
      userId: 1002,
      reservationId: 5002,
    },
  },
  {
    id: 6,
    lockerRoomId: 'C303',
    name: 'Locker 6',
    status: 'unassigned',
  },
  {
    id: 7,
    lockerRoomId: 'D404',
    name: 'Locker 7',
    status: 'assigned',
    assignment: {
      assignedAt: (() => {
        const date = new Date();
        date.setHours(11, 45, 0); // 11:45:00
        return date;
      })(),
      userId: 1003,
      reservationId: 5003,
    },
  },
  {
    id: 8,
    lockerRoomId: 'D404',
    name: 'Locker 8',
    status: 'unassigned',
  },
  {
    id: 9,
    lockerRoomId: 'E505',
    name: 'Locker 9',
    status: 'disabled',
  },
  {
    id: 10,
    lockerRoomId: 'E505',
    name: 'Locker 10',
    status: 'unassigned',
  },
];
