'use strict';

const shapePlacement = (config) => ({
  mount_selector: config?.appearance?.mount_selector || null,
});

const shapeButton = (config) => ({
  label: 'Llamar',
  html: {
    idle: config?.appearance?.html?.idle || null,
    connecting: config?.appearance?.html?.connecting || null,
    in_call: config?.appearance?.html?.in_call || null,
  },
});

module.exports = { shapePlacement, shapeButton };
