<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('app:send-calibration-reminder')
    ->dailyAt('08:00');