var options1 = getOptions(income, expense);
var cashflowchart = new ApexCharts(
    document.querySelector("#chart"),
    options1
);
cashflowchart.render();

var incomechart = new ApexCharts(document.querySelector("#income_trend"), getDIncomeOptions(income, 'Income', 'rgba(0, 199, 17)'));
incomechart.render()
var expensechart = new ApexCharts(document.querySelector("#expense_trend"), getDIncomeOptions(expense, 'Expense', '#E64040'));
expensechart.render()

$(window).on('load', function (e) {
    $('#expense_total').html('£' + Math.round(expense.reduce((a, b) => a + b, 0)));
    $('#income_total').html('£' + Math.round(income.reduce((a, b) => a + b, 0)));
    $('.recent-container').css('height', $('#mainrow').height());

    const ps = new PerfectScrollbar('.recent-container');
    const psfull = new PerfectScrollbar('#main-section');
    window.dispatchEvent(new Event('resize'));

});


var socket = io();
socket.on('group update', function (data) {
    //toastr.info('Rog Wood has updated an Income, please refresh the page to see these changes reflected!', 'User Group Data Update');
    console.log(data);
    renderCharts(data);
});
socket.on('notification', function (data) {
    //toastr.info('Rog Wood has updated an Income, please refresh the page to see these changes reflected!', 'User Group Data Update');
    console.log(getNotificationString(data));
    $( ".widget-heading" ).append(getNotificationString(data));

});

function renderCharts(data) {
    cashflowchart.updateSeries([{
        name: 'Income',
        data: data.income_per_month
    }, {
        name: 'Expenses',
        data: data.expense_per_month
    }])
    incomechart.updateSeries([{
        name: 'Income',
        data: data.income_per_month
    }])
    expensechart.updateSeries([{
        name: 'Expense',
        data: data.expense_per_month
    }])
    cashflowchart.clearAnnotations();
    newAnnotations();
    try {
        $('#expense_total').html('£' + Math.round(data.expense_per_month.reduce((a, b) => a + b, 0)));
        $('#income_total').html('£' + Math.round(data.income_per_month.reduce((a, b) => a + b, 0)));
    } catch (e) {
    }
}

function newAnnotations() {
    const highest1 = cashflowchart.getHighestValueInSeries(0);
    const highest2 = cashflowchart.getHighestValueInSeries(1);

    cashflowchart.addPointAnnotation({
        x: new Date(cashflowchart.w.globals.seriesX[0][cashflowchart.w.globals.series[0].indexOf(highest1)]).getTime(),
        y: highest1,
        label: {
            style: {
                cssClass: 'd-none'
            }
        },
        customSVG: {
            SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#4abf3f" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
            cssClass: undefined,
            offsetX: -8,
            offsetY: 5
        }
    })

    cashflowchart.addPointAnnotation({
        x: new Date(cashflowchart.w.globals.seriesX[1][cashflowchart.w.globals.series[1].indexOf(highest2)]).getTime(),
        y: highest2,
        label: {
            style: {
                cssClass: 'd-none'
            }
        },
        customSVG: {
            SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#e7515a" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
            cssClass: undefined,
            offsetX: -8,
            offsetY: 5
        }
    })
}
function getNotificationString(data) {
    var notificationString = '<div class="row"> <div class="col-9"><p style="margin-bottom: 1px">' + data.title + '</p><p style="margin-bottom: 1px">' + getDateFormat(data.date_time) + '</p></div><div class="col-3"> <img src="https://eu.ui-avatars.com/api/?name=' + data.user.first_name +'+'+ data.user.last_name + '&background=' + data.user.colour + '&rounded=true&size=40&bold=true" alt="" id="recent-avatars"> </div> </div> <div class="row"> <div class="col-12"> <p class="noti-desc">' + data.description + '</p> </div> </div>';
    return notificationString
}
function getDateFormat(date){
    var inputDate = new Date(date);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
var formattedDate = inputDate.getDate() + ' '+ monthNames[inputDate.getMonth()] +' - '+inputDate.getFullYear();
    return formattedDate
}