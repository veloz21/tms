export class MenuConfig {
  public defaults: any = {
    header: {
      self: {},
      items: [
        {
          title: 'Dashboards',
          root: true,
          alignment: 'left',
          page: '/dashboard',
          translate: 'MENU.DASHBOARD',
        },
        // {
        //   title: 'Applications',
        //   root: true,
        //   alignment: 'left',
        //   toggle: 'click',
        //   submenu: [{
        //     title: 'Paysheet',
        //     bullet: 'dot',
        //     icon: 'flaticon-avatar',
        //     submenu: [{
        //       title: 'Employees',
        //       page: '/paysheet/employees'
        //     }]
        //   },
        //   {
        //     title: 'Travels',
        //     bullet: 'dot',
        //     icon: 'flaticon-paper-plane',
        //     submenu: [{
        //       title: 'Travels',
        //       page: '/travel/travel'
        //     }]
        //   },
        //   {
        //     title: 'Workshop',
        //     bullet: 'dot',
        //     icon: 'flaticon-truck',
        //     submenu: [{
        //       title: 'Boxes',
        //       page: '/workshop/boxes',
        //       translate: 'WORKSHOP.BOXES.BOXES'
        //     },
        //     {
        //       title: 'Maintenance',
        //       page: '/workshop/maintenances',
        //       translate: 'WORKSHOP.MAINTENANCE.ENTITIES.VALUE'
        //     },
        //     {
        //       title: 'Tires',
        //       page: '/workshop/tires',
        //       translate: 'WORKSHOP.TIRES.TIRES'
        //     },
        //     {
        //       title: 'Trucks',
        //       page: '/workshop/trucks',
        //       translate: 'WORKSHOP.TRUCK.ENTITIES.VALUE'
        //     }
        //     ]
        //   },
        //   ]
        // },
      ],
    },
    aside: {
      self: {},
      items: [
        {
          title: 'Dashboard',
          root: true,
          icon: 'flaticon2-architecture-and-city',
          page: '/dashboard',
          translate: 'MENU.DASHBOARD',
          bullet: 'dot',
        },
        {
          title: 'Travels',
          bullet: 'dot',
          icon: 'flaticon-paper-plane',
          translate: 'TRAVELS.ENTITIES.VALUE',
          page: '/travels',
        },
        {
          title: 'Admin',
          bullet: 'dot',
          icon: 'flaticon-avatar',
          translate: 'ADMIN.ADMIN',
          submenu: [
            {
              title: 'Users',
              page: '/admin/users',
              translate: 'ADMIN.USERS.ENTITIES.VALUE',
            },
            {
              title: 'Employees',
              page: '/paysheet/employees',
              translate: 'PAYSHEET.EMPLOYEE.ENTITIES.VALUE',
            },
          ],
        },
        {
          title: 'Workshop',
          bullet: 'dot',
          icon: 'flaticon-truck',
          translate: 'WORKSHOP.WORKSHOP',
          submenu: [
            {
              title: 'Boxes',
              page: '/workshop/boxes',
              translate: 'WORKSHOP.BOXES.ENTITIES.VALUE',
            },
            {
              title: 'Maintenance',
              page: '/workshop/maintenances',
              translate: 'WORKSHOP.MAINTENANCE.ENTITIES.VALUE',
            },
            {
              title: 'Tires',
              page: '/workshop/tires',
              translate: 'WORKSHOP.TIRES.ENTITIES.VALUE',
            },
            {
              title: 'Trucks',
              page: '/workshop/trucks',
              translate: 'WORKSHOP.TRUCK.ENTITIES.VALUE',
            },
          ],
        },
      ],
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
