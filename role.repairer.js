let roleBuilder = require("role.builder");

var roleRepairer = {

  /** @param {Creep} creep **/
  run: function(creep) {
      // if creep is trying to complete a repair but has no energy held
      if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
        // switch state to false
        creep.memory.working = false;
        creep.say('🔄 harvest');
      } else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        // Switch state to true
        creep.memory.working = true;
        creep.say('🚧 build');
      }

      if (creep.memory.working) {
        let repairStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          // "s" refers to structure
          filter: (s) => s.hits < 50000
        });

        if (repairStructure != null) {
            if (creep.repair(repairStructure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairStructure, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            roleBuilder.run(creep);
        }
    } else {
      var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
              return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                     structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
          }
      });
      if (container) {
          if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
          }
      } else {
          var source = creep.pos.findClosestByPath(FIND_SOURCES);
          if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
              creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
          }
      }
    }
  }
};

module.exports = roleRepairer;
