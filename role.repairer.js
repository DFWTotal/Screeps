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

      if(creep.memory.working) {
        let repairStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          // "s" refers to structure
          filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
        });
        if(repairStructure != undefined){
          if (creep.repair(repairStructure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(repairStructure);
          }
        } else {
          roleBuilder.run(creep);
        }

      } else {
          var source = creep.pos.findClosestByPath(FIND_SOURCES);
          if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
              creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
          }
      }
  }
};

module.exports = roleRepairer;
