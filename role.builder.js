var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('🚧 build');
        }

        if(creep.memory.working) {
            let conTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            let repTargets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            if(conTargets.length) {
                if(creep.build(conTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(conTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (repTargets > 0) {
                if(creep.repair(repTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repTargets[0]);
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;

/*
===== Spawn a creep =====
Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], 'b1', {
    memory: {role: 'builder'}
});
*/