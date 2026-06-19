<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $equipment_id
 * @property int|null $report_id
 * @property string|null $certificate_number
 * @property string|null $certificate_file
 * @property string|null $testing_institution
 * @property \Illuminate\Support\Carbon $calibration_date
 * @property \Illuminate\Support\Carbon $next_calibration_date
 * @property string $result
 * @property string|null $notes
 * @property int $created_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $admin
 * @property-read \App\Models\Equipment|null $equipment
 * @property-read \App\Models\Report|null $report
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereCalibrationDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereCertificateFile($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereCertificateNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereEquipmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereNextCalibrationDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereReportId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereResult($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereTestingInstitution($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Calibration whereUpdatedAt($value)
 */
	class Calibration extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $room_id
 * @property string $inventory_number
 * @property string $name
 * @property string|null $brand
 * @property string|null $serial_number
 * @property string $condition
 * @property \Illuminate\Support\Carbon|null $next_calibration_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Calibration> $calibrations
 * @property-read int|null $calibrations_count
 * @property-read \App\Models\Calibration|null $latestCalibration
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\EquipmentMovement> $movements
 * @property-read int|null $movements_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Report> $reports
 * @property-read int|null $reports_count
 * @property-read \App\Models\Room $room
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereBrand($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereCondition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereInventoryNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereNextCalibrationDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereRoomId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereSerialNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Equipment withoutTrashed()
 */
	class Equipment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\Equipment|null $equipment
 * @property-read \App\Models\Room|null $fromRoom
 * @property-read \App\Models\User|null $mover
 * @property-read \App\Models\Room|null $toRoom
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EquipmentMovement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EquipmentMovement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EquipmentMovement query()
 */
	class EquipmentMovement extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $ticket_number
 * @property int $equipment_id
 * @property int $reported_by
 * @property string $type
 * @property string $description
 * @property string|null $action_taken
 * @property string|null $external_technician
 * @property int $cost
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $estimated_completion
 * @property \Illuminate\Support\Carbon|null $resolved_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Calibration|null $calibrationData
 * @property-read \App\Models\Equipment|null $equipment
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ReportProgress> $progressLogs
 * @property-read int|null $progress_logs_count
 * @property-read \App\Models\User $reporter
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereActionTaken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereEquipmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereEstimatedCompletion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereExternalTechnician($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereReportedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereResolvedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereTicketNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereUpdatedAt($value)
 */
	class Report extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $report_id
 * @property int $updated_by
 * @property string $status_snapshot
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Report $report
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReportProgress newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReportProgress newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReportProgress query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReportProgress whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReportProgress whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReportProgress whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReportProgress whereReportId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReportProgress whereStatusSnapshot($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReportProgress whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReportProgress whereUpdatedBy($value)
 */
	class ReportProgress extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Equipment> $equipments
 * @property-read int|null $equipments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Room whereUpdatedAt($value)
 */
	class Room extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $role
 * @property string|null $phone_number
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property bool $is_active
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $room_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Calibration> $calibrations
 * @property-read int|null $calibrations_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ReportProgress> $progressUpdates
 * @property-read int|null $progress_updates_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Report> $reports
 * @property-read int|null $reports_count
 * @property-read \App\Models\Room|null $room
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhoneNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRoomId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

