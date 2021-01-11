/**
 * Get options for our Income/expense Apex chart for the dashboard(Preconfigured)
 */
function getDIncomeOptions(transaction_data, transaction_string, transaction_colour) {
    var options1 = {
            chart: {
                id: 'sparkline1',
                type: 'area',
                height: 160,
                sparkline: {
                    enabled: true
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            series: [{
                name: transaction_string,
                data: transaction_data
            }],
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            yaxis: {
                min: 0
            },
            colors: [transaction_colour],
            tooltip: {
                x: {
                    show: false,
                }
            },
            fill: {
                type:"gradient",
                gradient: {
                    type: "vertical",
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: .30,
                    opacityTo: .05,
                    stops: [45, 100]
                }
            },
        }
    return options1;

}