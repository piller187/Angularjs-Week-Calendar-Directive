var app = angular.module("myApp", []);

// test controller
app.controller("myController", function () {
    var vm = this;

    vm.selectedDate = "";

    vm.dateChange = function (dt) {
        vm.selectedDate = dt;
        console.log("Date Model: " + vm.selectedDate);
    }
});

// our calendar component
app.directive('holCalendar', function () {
    return {
        restrict: 'E',
        controller: HolidayCalendar,
        templateUrl: 'HolWeekCalendarTemplate.html',
        bindToController: true,
        controllerAs: 'vm',
        scope: {
            returnedDay: '@',
            onChange: '&'
        }
    };
});


function HolidayCalendar() {
    var vm = this;

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    function createArray(length) {
        var arr = new Array(length || 0),
          i = length;

        arr.fill("");

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) arr[length - 1 - i] = createArray.apply(this, args);
        }

        return arr;
    }

    function getWeekNbr(year, month, day) {
        function serial(days) {
            return 86400000 * days;
        }

        function dateserial(year, month, day) {
            return (new Date(year, month - 1, day).valueOf());
        }

        function weekday(date) {
            return (new Date(date)).getDay() + 1;
        }

        function yearserial(date) {
            return (new Date(date)).getFullYear();
        }
        var date = year instanceof Date ? year.valueOf() : typeof year === "string" ? new Date(year).valueOf() : dateserial(year, month, day),
          date2 = dateserial(yearserial(date - serial(weekday(date - serial(1))) + serial(4)), 1, 3);
        return ~~((date - date2 + serial(weekday(date2) + 5)) / serial(7));
    }

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function getDateOfWeek(weekNumber, year) {
        //Create a date object starting january first of chosen year, plus the number of days in a week multiplied by the week number to get the right date.
        return new Date(year, 0, 1 + ((weekNumber - 1) * 7));
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function clearCal() {
        for (var week = 0; week < 6; week++) {
            for (var day = 0; day < 7; day++) {
                vm.cal[week][day] = "";
            }
        }
    }

    function clearWeeks() {
        for (var week = 0; week < 6; week++) {
            vm.weeks[week] = "";
        }
    }

    function fillOutCurrentMonth(year, month) {
        var date = new Date(year, month, 1);

        clearCal();
        clearWeeks();

        // get the first day and the total number of days in this month
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        var totalDaysInMonth = daysInMonth(vm.currentMonthNbr + 1, vm.currentYear);

        // adjust for starting on monday vs sunday (js starts the week on sunday)
        if (firstDay === 0)
            firstDay = 6;
        else
            firstDay--;

        var dayCount = 1;
        var weekIndex = 0;

        // 1st week is special and we need to know what day of the week the 1st is on
        for (var day = 0; day < 7; day++) {
            if (day >= firstDay) {
                vm.cal[0][day] = dayCount;

                // handle filling in week nbr for the first week if it starts on a monday for this month/year
                if (day === 0) { // 0 = Monday
                    // even though we are checking for monday we need to add 1 day to it to make it a Tue in order for the getWeekNbr() to correctly handle DST
                    vm.weeks[weekIndex] = getWeekNbr(vm.currentYear, vm.currentMonthNbr + 1, dayCount + 1);
                }

                dayCount++;
            }
        }

        weekIndex++;

        // fill in the rest of the weeks
        for (var week = 1; week < 6; week++) {
            for (day = 0; day < 7; day++) {
                vm.cal[week][day] = dayCount;

                // handle filling the week number        
                if (day === 0) { // 0 = Monday
                    // even though we are checking for monday we need to add 1 day to it to make it a Tue in order for the getWeekNbr() to correctly handle DST
                    vm.weeks[weekIndex] = getWeekNbr(vm.currentYear, vm.currentMonthNbr + 1, dayCount + 1);
                    weekIndex++;
                }

                dayCount++;

                if (dayCount > totalDaysInMonth)
                    return;
            }
        }
    }

    // init to todays month/year
    var date = new Date();
    vm.currentMonthNbr = date.getMonth();
    vm.currentMonth = monthNames[vm.currentMonthNbr];
    vm.currentYear = date.getFullYear();
    vm.selectedWeekIndex = -1;
    vm.cal = createArray(6, 7);
    vm.weeks = createArray(6);

    // when there is a highlighted week already but the user is navigating to other month/years
    vm.savedWeekIndex = -1;
    vm.savedWeekMonth = "";
    vm.savedWeekYear = 0;

    vm.showCal = false;

    fillOutCurrentMonth(vm.currentYear, vm.currentMonthNbr);

    vm.onClick = function (event) {
        // when we click the input box save off the results
        vm.savedWeekIndex = vm.selectedWeekIndex;
        vm.savedWeekMonth = vm.currentMonth;
        vm.savedWeekYear = vm.currentYear;

        vm.showCal = true;
    };

    vm.close = function () {
        vm.showCal = false;
    }

    // clicking the week is the driving force of this control
    vm.weekClick = function (index) {
        vm.selectedWeekIndex = index; // this is for highlighting the week in the calendar html
        vm.selectedWeek = vm.weeks[vm.selectedWeekIndex]; // this sets the week number

        // calculate the monday of this week
        var mondayOfWeek = getDateOfWeek(vm.selectedWeek, vm.currentYear);

        // get the day the user said they wanted in this week
        var finalDate = addDays(mondayOfWeek, days.indexOf(vm.returnedDay.toLowerCase()));

        vm.week = "Week " + vm.selectedWeek + ", " + vm.currentYear;

        vm.showCal = false;

        // raise our event
        vm.onChange({
            dt: finalDate
        });
    };

    vm.lowerMonth = function () {
        vm.currentMonthNbr--;

        if (vm.currentMonthNbr < 0)
            vm.currentMonthNbr = 11;

        vm.currentMonth = monthNames[vm.currentMonthNbr];

        // restore the selected week as we're navigating between month/years
        if (vm.currentMonth === vm.savedWeekMonth && vm.savedWeekYear === vm.currentYear)
            vm.selectedWeekIndex = vm.savedWeekIndex;
        else
            vm.selectedWeekIndex = -1;

        fillOutCurrentMonth(vm.currentYear, vm.currentMonthNbr);
    };

    vm.higherMonth = function () {
        vm.currentMonthNbr++;

        if (vm.currentMonthNbr > 11)
            vm.currentMonthNbr = 0;

        vm.currentMonth = monthNames[vm.currentMonthNbr];

        // restore the selected week as we're navigating between month/years
        if (vm.currentMonth === vm.savedWeekMonth && vm.savedWeekYear === vm.currentYear)
            vm.selectedWeekIndex = vm.savedWeekIndex;
        else
            vm.selectedWeekIndex = -1;

        fillOutCurrentMonth(vm.currentYear, vm.currentMonthNbr);
    };

    vm.lowerYear = function () {
        vm.currentYear--;

        vm.currentMonth = monthNames[vm.currentMonthNbr];

        // restore the selected week as we're navigating between years
        if (vm.currentMonth === vm.savedWeekMonth && vm.savedWeekYear === vm.currentYear)
            vm.selectedWeekIndex = vm.savedWeekIndex;
        else
            vm.selectedWeekIndex = -1;

        fillOutCurrentMonth(vm.currentYear, vm.currentMonthNbr);
    };

    vm.higherYear = function () {
        vm.currentYear++;

        vm.currentMonth = monthNames[vm.currentMonthNbr];

        // restore the selected week as we're navigating between years
        if (vm.currentMonth === vm.savedWeekMonth && vm.savedWeekYear === vm.currentYear)
            vm.selectedWeekIndex = vm.savedWeekIndex;
        else
            vm.selectedWeekIndex = -1;

        fillOutCurrentMonth(vm.currentYear, vm.currentMonthNbr);
    };
}