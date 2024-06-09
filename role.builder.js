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
                filter: object => object.hits < object.hitsMax && object.hits < 10000
            });
            if(conTargets.length > 0) {
                if(creep.build(conTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(conTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (repTargets.length > 0) {
                if(creep.repair(repTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repTargets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;