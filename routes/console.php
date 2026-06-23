<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('app:send-calibration-reminder')->dailyAt('08:00');
Schedule::command('app:send-maintenance-wa')->dailyAt('07:00');