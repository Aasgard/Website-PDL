$.getJSON('/json/bestPlayers.json', function (data){
    $('#best_players_table').dynatable({
        dataset: {
            records: data[0].best_players
        },
        features: {
            paginate: false,
            search: false,
            recordCount: false,
            sorting: false
        }, table: {
            defaultColumnIdStyle: 'underscore'
        }
    });
});

$.getJSON('/json/bestGames.json', function (data){
    $('#best_games_table').dynatable({
        dataset: {
            records: data[0].best_games
        },
        features: {
            paginate: false,
            search: false,
            recordCount: false,
            sorting: false
        }, table: {
            defaultColumnIdStyle: 'lowercase'
        }
    });
});

$.getJSON('/json/statsBDD.json', function (data){
    $('#bdd_stats_table').dynatable({
        dataset: {
            records: data[0].global_stats
        },
        features: {
            paginate: false,
            search: false,
            recordCount: false,
            sorting: false
        }, table: {
            defaultColumnIdStyle: 'lowercase'
        }
    });
});