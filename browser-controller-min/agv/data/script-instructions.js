module.exports = [
  {
    name: 'SetButton',
    help: 'Trigger the system button.\
    Parameters: 0=Start/1=Stop'
  },
  {
    name: 'ShowLamp',
    help: 'Set the light output behavior.\
    Parameter 1: red light behavior.0:turn off the light.1:turn on the light.2:slow flash.3:fast flash\
    Parameter 2: green light behavior.0:turn off the light.1:turn on the light.2:slow flash.3:fast flash\
    Parameter 3: yellow light behavior.0:turn off the light.1:turn on the light.2:slow flash.3:fast flash'
  },
  {
    name: 'SetIO',
    help: 'Close or open IO output.\
    close:SetIO(number,0).\
    open:SetIO(number,1)'
  },
  {
    name: 'PlaySound',
    help: 'Set the sound broadcast.\
    Parameter 1: 0 means stop playing. Non-negative value. Represents the music number'
  },
  {
    name: 'SetTurnMode',
    help: 'Set the turn mode.\
    Parameter 1: Turn marker\
    0 left turn / 1 right turn / 2 straight / 3 left 90 degree turn / 4 left 180 degree turn / 5 right 90 degree turn / 6 right 180 degree turn'
  },
  {
    name: 'SetObsType',
    help: 'Obstacle detect config.\
    Arg 1: Area Number.'
  },
  {
    name: 'SelectSpeedLevel',
    help: 'Update speed(except map navigate mode).\
    Arg 1:Speed Level'
  },
  {
    name: 'SetCtrlMode',
    help: 'Set the control mode.\
    Parameter 1: Mode identifier.\
    0 magnetic map navigation / 1 magnetic tracing mode / 2 magnetic forced turn mode'
  },
  {
    name: 'FindPose',
    help: 'Map navigation initialization. \
    Arg 1:0 for automatic initialization, 1 for manual, \
    Arg 2: [when Arg 1=1]first landmark site,\
    Arg 3: [when Arg 1=1] the second landmark site. \
    Arg 4:[when Arg 1 = 0] 0 for postive direction, 1 for negative.'
  },
  {
    name: 'QueryBattery',
    help: 'Query the current remaining power.'
  },
  {
    name: 'GetIO',
    help: 'Query IO state,Two Arguments.\
    Arg 1:0 intend DI ,1 intend DO .\
    Arg 2：IO Number.'
  },
  {
    name: 'GetPosition',
    help: 'Current position.\
    postion = GetPosition()'
  },
  {
    name: 'GetPosition',
    help: 'Current position.\
    postion = GetPosition()'
  },
  {
    name: 'GetTarget',
    help: 'Current target.\
postion = GetTarget()'
  },
  {
    name: 'GetPrePosition',
    help: 'pre rfid.\
postion = GetPrePosition()'
  },
  {
    name: 'GetDirection',
    help: 'current drive direction.\
    direction = GetDirection()\
    0=forword\
    1=back\
    2=left\
    3=right'
  },
  {
    name: 'GetTime',
    help: 'Get the current system time.\
time = GetTime()\
ms'
  },
  {
    name: 'SysLog',
    help: 'Print system log for debugging\
SysLog(var)'
  },
  {
    name: 'IsTaskRunning',
    help: 'Whether the task chain is running or not.\
ret = IsTaskRunning()'
  },
  {
    name: 'IsScriptRunning',
    help: 'Whether the system script is running or not.\
ret = IsScriptRunning()'
  },
  {
    name: 'SysErr',
    help: 'Set the system user fault.\
    Set:SysErr(true) \
    Clear:SysErr(false)'
  },
  {
    name: 'UserErr',
    help: 'Sets a user alarm or fault.\
Set a warning:UserErr(bit,true) \
Clear the warning:UserErr(bit,false) \
Set error:UserErr(bit,true,0) \
Clear error:UserErr(bit,false,0)'
  },
  {
    name: 'SetCode',
    help: 'Sets the script\'s real-time feedback code.\
SetCode(code) '
  },
  {
    name: 'GetUserData',
    help: 'Get the user area data, which is usually maintained by the upper system.\
data = GetUserData(0) '
  },
  {
    name: 'ClearUserData',
    help: 'Clear the user area data, which is generally maintained by the upper system.\
ClearUserData() '
  },
  {
    name: 'SetUserData',
    help: 'Set the user area data\
    SetUserData(addr,value) '
  },
  {
    name: 'SetAlignment',
    help: ''
  },
  {
    name: 'GoTo',
    help: 'Set or cancel the navigation destination.\
Parameter 1: 0 is to cancel the navigation, other non-negative values are the destination of the navigation'
  },
  {
    name: 'SetTempTarget',
    help: ''
  },
  {
    name: 'SetDirection',
    help: 'Set the direction of the navigation drive.\
SetDirection(direction)\
direction can have the following values.\
0:Forward traction / 1:Backward traction / 2:Left traction / 3:Right traction / 4:Switch traction direction'
  },
  {
    name: 'SetTable',
    help: 'change instruction table.\
SetTable(table_id)'
  },
  {
    name: 'GetCallerID',
    help: 'GetCaller ID.\
id = GetCallerID()\
Return -1 when no caller exists'
  },
  {
    name: 'GetCallerParam',
    help: 'Get caller param.\
param = GetCallerParam(index)'
  },
  {
    name: 'FreeMove',
    help: 'Sends a free navigation motion command.\
FreeMove(linear_vel,angular_vel,angle) \
linear_vel: linear velocity, in mm/s \
angular_vel: angular velocity, unit mrad/s \
angle: direction of linear velocity, unit mrad '
  },
  {
    name: 'GetErrCode',
    help: 'Cargo fault area code\
code = GetErrCode(area) \
area=0:user fault area code \
area=1:system fault area code'
  },
  {
    name: 'GetWarnCode',
    help: 'Cargo fault area code\
code = GetWarnCode(area,index) \
area=0:User warning area code \
area=1:system warning area code \
index:warning area byte index '
  },
  {
    name: 'GetObstracle',
    help: 'Get the state of the obstacle in the specified direction\
state = GetObstracle(direct) direct parameter:\
0=forward traction \
1=backward traction \
2=leftward traction \
3=rightward traction \
state:0=No obstacle / 1=Deceleration obstacle / 2=Stop obstacle / 3=Emergency stop obstacle'
  },
  {
    name: 'EnableTask',
    help: 'Whether to disable the upper navigation task command\
state = EnableTask(enabled) direct parameter:\
true: accept navigation tasks from the host computer \
false: do not accept navigation tasks sent by the host'
  },
  {
    name: 'GetApiTime',
    help: 'Get the time of the last API command\
time = GetApiTime()'
  },
  {
    name: 'IsInit',
    help: 'Whether the magnetic navigation map has been initialized\
init = IsInit()'
  },
  {
    name: 'SetUserObs',
    help: 'Set user-defined obstacles\
SetUserObs(direct,channel,stat)\
direct:direction\
channel:obstacle channel\
stat:obstacle state'
  },
  {
    name: 'IsStatic',
    help: 'Whether the AGV is moving or not'
  },
  {
    name: 'CallTasklink',
    help: 'Call tasklink.\
format:ret-CallTasklink(id)\
Arg 1:task ID \
return:True or False\
True for success'
  },
  {
    name: 'Exit',
    help: 'Terminates the system script.\
This function forcibly terminates the system script and requires the caller to maintain cleanup.'
  },
  {
    name: 'WaitIO',
    help: 'Wait IO input state or output state, two parameters.\
Parameter 1:0 means input IO,1 means output IO.\
Parameter 2: IO serial number.'
  },
  {
    name: 'Sleep',
    help: 'Delay(s):Sleep(1)'
  },
  {
    name: 'WaitPosition',
    help: 'Wait for the robot to pass the position point.\
Parameter 1: Positioning tag location point to wait for'
  },
  {
    name: 'WaitSysState',
    help: 'Wait for the robot to be in the specified running state.\
Parameter 1: the state to wait for (0:stop state,1:run state)'
  },
  {
    name: 'WaitStart',
    help: 'Wait until the start button is pressed'
  },
  {
    name: 'GoToAndWait',
    help: 'Set the navigation target and wait for the task to finish.\
Parameter 1: non-negative value. Represents the destination of the navigation'
  },
  {
    name: 'WaitNaviTask',
    help: 'Wait for the navigation task to finish running.\
WaitTask()'
  },
  {
    name: 'WaitTaskLink',
    help: 'Wait for the task chain to finish running.\
WaitTaskLink()'
  },
  {
    name: 'WaitInstruct',
    help: 'Wait for the end of the current command table run'
  },
];
