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

$.getJSON('/json/Player.json', function (data){

   // var idJoueur = getURLParameter("idPlayer");
    var idJoueur = 4;
    var joueur = null;

    // Parcours les joueurs
    $.each(data, function(key, object){
        // Parcours les infos d'un joueur
        $.each(object, function(keyJson, valueJson){

            // Retourne le joueur recherché
            if (keyJson == "id" && valueJson == idJoueur){
                joueur = object;
            }
        });
    });


    function getWinRate(joueur){
        var winRates = {win : 0, loose : 0, deuce : 0};
        var nbGamesPlayed = 1;
        $.each(joueur, function(key, value){
            if (key == "nb_games_played"){
                nbGamesPlayed = value;
            }else if(key == "nb_games_win"){
                winRates["win"] = value;
            }else if(key == "nb_games_loose"){
                winRates["loose"] = value;
            }
        });
        winRates["deuce"] = (nbGamesPlayed - winRates["win"] + winRates["loose"]) / nbGamesPlayed ;
        winRates["win"] = winRates["win"] / nbGamesPlayed;
        winRates["loose"] = winRates["loose"] / nbGamesPlayed;
        return winRates;
    }
/**
    $('#blunder_mat').dynatable({
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
*/
    var winRates = getWinRate(joueur);
    $('#pie_win_rates').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            backgroundColor:'rgba(255, 255, 255, 0)'
        },
        title: {
            text: 'Win rate'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Win rates',
            colorByPoint: true,
            data: [{
                name: 'Win',
                y: winRates["win"]
            }, {
                name: 'Loose',
                y: winRates["loose"],
                sliced: true,
                selected: true
            },{
                name: 'Deuce',
                y: winRates["deuce"]
            }]
        }]
    });
});