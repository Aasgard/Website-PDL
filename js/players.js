


function findPlayerById(idJoueur) {

    // Récupère les joueurs du fichier json
    $.getJSON('/json/Player.json', function (data) {
        // Parcours les joueurs
        $.each(data, function (key, joueur) {
            // Parcours les infos d'un joueur
            $.each(joueur, function (keyJson, valueJson) {
                // Retourne le joueur recherché
                if (keyJson.search("id") != -1 && valueJson == idJoueur) {
                    console.log(joueur);
                    getWinRate(joueur);
                    getVariationElo(joueur);
                }
            });
        });
    });
    return null;
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
    console.log(nbGamesPlayed);
    winRates["deuce"] = nbGamesPlayed - (winRates["win"] + winRates["loose"]);
    winRates["win"] = winRates["win"];
    winRates["loose"] = winRates["loose"];
    pie_win_rates(winRates);
}

function getVariationElo(joueur) {
    var eloByDate = {date: 0, elo: 0};
    console.log(joueur);
    $.each(joueur, function (key, value) {
        if (key == "elos") {
            var i = 0;
            $.each(value, function (date, elo) {
                eloByDate["date"][i] = date;
                eloByDate["elo"][i] = elo;
                i++;
            });
        }
    });
    graphe_elo(eloByDate);
}

$('#players_table').DataTable({
    "processing": false,
    "info": false,
    "searching": true,
    "ordering": true,
    "order": [[ 0, 'desc' ], [ 1, 'asc' ]],
    "lengthChange": false,
    "pageLength": 15,
    "ajax": {
        "url": "json/Player.json",
        "dataSrc": ""
    },
    "columns": [
        {"data": "elos.0.elo"},
        {
            "data": "name",
            "render": function (data, type ,row) {
                return "<a href='player.html?p=" + row["id"] + "'>" + data + "</a>";
            }
        },
        {"data": "nb_games_win"}
    ]
});
/**
[
    {
        "best_players": [
            {
                "nb_games_loose": 0,
                "name": "Mamedjarova,Z",
                "nb_games_win": 2,
                "rang": 1
        ],
        "id": 1
    }]
*/

var idJoueur = getURLParameter("idPlayer");
console.log(idJoueur);
findPlayerById(idJoueur);
function graphe_elo(eloByDate) {

    $('#graphe_elo').highcharts({
        chart: {
            type: 'bar',
            backgroundColor: 'rgba(255, 255, 255, 0)'
        },
        title: {
            text: 'Variation du Elo',
            x: -20 //center
        },
        xAxis: {
            categories: eloByDate[0]
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
            name: 'Nom du joueur',
            data: eloByDate[1]
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