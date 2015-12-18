var idJoueur = getURLParameter("p");
findPlayerById(idJoueur);

function findPlayerById(idJoueur) {

    // Récupère les joueurs du fichier json
    $.getJSON('/json/Player.json', function (data) {
        // Parcours les joueurs
        $.each(data, function (key, joueur) {
            // Parcours les infos d'un joueur
            $.each(joueur, function (keyJson, valueJson) {
                // Retourne le joueur recherché
                if (keyJson.search("id") != -1 && valueJson == idJoueur) {
                    setBlunderData(joueur);
                    $(".nomPersonne").html(joueur.name);
                    getWinRate(joueur);
                    getVariationElo(joueur);
                }
            });
        });
    });
    return null;
}

function setBlunderData(joueur){
    var errorsArray = [];
    // Récupère les games du fichier json
    $.getJSON('/json/Game.json', function (data) {

        var errors = joueur.errors;
        // Parcours les erreurs d'un joueur
        $.each(errors, function (keyError, error) {

            // Parcours les games
            $.each(data, function (key, game) {
                 if (game.id_game == error.id_game){

                     // Détermine l'adversaire
                     var adversaire = "";
                     if (game.id_white == joueur.id){
                         adversaire = game.name_black;
                     }else{
                         adversaire = game.name_white;
                     }

                     errorsArray.push({
                         id_game: game.id_game,
                         nb_of_error: error.nb_of_erreur,
                         errors_fen: error.errors_fen,
                         date: game.date,
                         name_adv: adversaire,
                     });
                     joueur.errors = errorsArray;
                     errorsArray = [];
                 }
            });
        });
        setBlunderTable(joueur);
    });
}

function setBlunderTable(joueur){

    $('#blunder_mat').DataTable({
        "processing": false,
        "info": false,
        "searching": false,
        "ordering": true,
        "lengthChange": false,
        "pageLength": 15,
        "data" : joueur["errors"],
        "columns": [
            {"data": "date"},
            {"data": "name_adv"},
            {
                "data": "voir",
                "render": function (data, type, row) {
                    return "<a href='game.html?g=" + row["id_game"] + "&fen=" + row["errors_fen"][0] + "'> Voir erreur </a>";
                },
                "className": "text-center"
            }
        ]
    });
}

function getWinRate(joueur) {
    var winRates = {win: 0, loose: 0, deuce: 0};
    var nbGamesPlayed = 1;
    $.each(joueur, function (key, value) {
        if (key == "nb_games_played") {
            nbGamesPlayed = value;
        } else if (key == "nb_games_win") {
            winRates["win"] = value;
        } else if (key == "nb_games_loose") {
            winRates["loose"] = value;
        }
    });
    winRates["deuce"] = nbGamesPlayed - (winRates["win"] + winRates["loose"]);
    winRates["win"] = winRates["win"];
    winRates["loose"] = winRates["loose"];
    pie_win_rates(winRates);
}

function getVariationElo(joueur) {
    var eloByDate = {date: [], elo: []};
    var i = 0;
    var elos = joueur.elos;
    $.each(elos, function (key, value) {
        eloByDate["date"][i] = value.date;
        eloByDate["elo"][i] = value.elo;
        i++;
    });
    graphe_elo(eloByDate);
}



function graphe_elo(eloByDate) {

    $('#graphe_elo').highcharts({
        chart: {
            type: 'line',
            backgroundColor: 'rgba(255, 255, 255, 0)'
        },
        title: {
            text: 'Variation du Elo',
            x: -20 //center
        },
        xAxis: {
            categories: eloByDate.date
        },
        yAxis: {
            title: {
                text: 'Elo'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Elo',
            data: eloByDate.elo
        }]
    });

}

function pie_win_rates(winRates) {

    $('#pie_win_rates').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            backgroundColor: 'rgba(255, 255, 255, 0)'
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
            }, {
                name: 'Deuce',
                y: winRates["deuce"]
            }]
        }]
    });

}

