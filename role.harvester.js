var roleHarvester = {
    run: function(creep) {
        if (!creep.memory.sourceId) {
            // Find all energy sources
            let sources = creep.room.find(FIND_SOURCES);
            let sourceCreeps = {};

            // Initialize count for each source
            sources.forEach(source => sourceCreeps[source.id] = 0);

            // Count creeps assigned to each source
            for (let name in Game.creeps) {
                let otherCreep = Game.creeps[name];
                if (otherCreep.memory.role == 'harvester' && otherCreep.memory.sourceId) {
                    sourceCreeps[otherCreep.memory.sourceId]++;
                }
            }

            // Assign the creep to the least crowded source
            let leastCrowdedSource = sources[0];
            for (let source of sources) {
                if (sourceCreeps[source.id] < sourceCreeps[leastCrowdedSource.id]) {
                    leastCrowdedSource = source;
                }
            }

            creep.memory.sourceId = leastCrowdedSource.id;
        }

        // Perform harvesting or transfer tasks
        if (creep.store.getFreeCapacity() > 0) {
            let source = Game.getObjectById(creep.memory.sourceId);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                           structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;
