let roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        } else if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('🚧 build');
        }

        if (creep.memory.working) {
            // Prioritize building construction sites
            let conTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (conTarget != null) {
                if (creep.build(conTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(conTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // If no construction sites, then repair
                let repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits < 10000
                });
                if (repairTarget != null) {
                    if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else {
                    // If no repair targets, switch to upgrading
                    roleUpgrader.run(creep);
                }
            }
        } else {
            // Harvest energy if not working
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = roleBuilder;
