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
        //       translate: 'WORKSHOP.MAINTENANCE.TEXT.MAINTENANCE'
        //     },
        //     {
        //       title: 'Tires',
        //       page: '/workshop/tires',
        //       translate: 'WORKSHOP.TIRES.TIRES'
        //     },
        //     {
        //       title: 'Trucks',
        //       page: '/workshop/trucks',
        //       translate: 'WORKSHOP.TRUCK.TEXT.TRUCK'
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
          translate: 'TRAVEL.TRAVEL.TEXT.TRAVEL',
          page: '/travels',
        },
        {
          title: 'Paysheet',
          bullet: 'dot',
          icon: 'flaticon-avatar',
          translate: 'PAYSHEET.PAYSHEET',
          submenu: [
            {
              title: 'Employees',
              page: '/paysheet/employees',
              translate: 'PAYSHEET.EMPLOYEE.TEXT.EMPLOYEE',
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
              translate: 'WORKSHOP.BOXES.TEXT.BOXES',
            },
            {
              title: 'Maintenance',
              page: '/workshop/maintenances',
              translate: 'WORKSHOP.MAINTENANCE.TEXT.MAINTENANCE',
            },
            {
              title: 'Tires',
              page: '/workshop/tires',
              translate: 'WORKSHOP.TIRES.TEXT.TIRES',
            },
            {
              title: 'Trucks',
              page: '/workshop/trucks',
              translate: 'WORKSHOP.TRUCK.TEXT.TRUCK',
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
