var roleBuilder = {
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
                if (otherCreep.memory.role == 'builder' && otherCreep.memory.sourceId) {
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

        // State machine logic to handle harvesting and building
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            let target = Game.getObjectById(creep.memory.targetConstructionSiteId);
            if (!target) {
                // Assign a common construction site if not already assigned
                let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (constructionSites.length) {
                    target = constructionSites[0];
                    creep.memory.targetConstructionSiteId = target.id;
                }
            }

            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                // Move to the spawn or storage to wait for construction sites
                let spawn = creep.room.find(FIND_MY_SPAWNS)[0];
                if (spawn) {
                    creep.moveTo(spawn);
                }
            }
        } else {
            let source = Game.getObjectById(creep.memory.sourceId);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleBuilder;
