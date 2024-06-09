let roleRepairer = require('role.repairer');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // if creep is carrying energy to spawn, has no energy capacity
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            // switch state
            creep.memory.working = false;
            creep.say('🔄 harvest');
        // if creeps carry capacity is full, starts to deposit
        } else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            // switch state
            creep.memory.working = true;
            creep.say('💰 deposit');
        }

        if (creep.memory.working) {
            // Find closest structure that needs energy
            let myStructures = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_CONTAINER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
                           (s.structureType != STRUCTURE_CONTAINER && s.energy < s.energyCapacity);
                }
            });
            if (myStructures != null) {
                if (creep.transfer(myStructures, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(myStructures, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                // If no structures need energy, repair buildings
                roleRepairer.run(creep);
            }
        } else {
            // Find sources to harvest energy
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = roleHarvester;