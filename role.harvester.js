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
            var myStructures = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => s.energy < s.energyCapacity
            });
            if (myStructures) {
                if (creep.transfer(myStructures, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(myStructures, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                // If no structures need energy, move to a designated idle position or some other task
                const targetPos = new RoomPosition(26, 8, creep.room.name);
                if (!creep.pos.isEqualTo(targetPos)) {
                    creep.moveTo(targetPos, {visualizePathStyle: {stroke: '#00ff00'}});
                }
            }
        } else {
            // Find sources to harvest energy
            var sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;