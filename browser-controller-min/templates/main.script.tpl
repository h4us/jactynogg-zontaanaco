def func_0()
  -- beep, lamp off
	SetIO(0, 1)
	SetIO(1, 1)
	SetIO(2, 1)
	SetIO(3, 1)
	SetIO(4, 1)
	SetIO(5, 1)
	SetIO(6, 1)
	SetIO(7, 1)
    ShowLamp(0, 0, 0)
done

def func_1()
    SetIO(20, 1)
    SetUserData(1, 1)
done

def func_2()
    SetIO(20, 0)
    SetUserData(1, 0)
done

def func_3()
    local p = GetPosition()
    if p == <%= c1 %> or p == <%= c2 %> or p == <%= c3 %> then
        local u = GetUserData(2)
        if p == u then
            --
            SetTurnMode(2)
        else
            -- Sleep(2)
            -- SetCtrlMode(2)
            -- SetTurnMode(5)
            -- SetDirection(0)
            -- SetCtrlMode(1)
            -- Sleep(2)
            SetTurnMode(1)
            SetUserData(2, p)
        done
    done
done

def func_4()
    -- closer, user data(2) invalidate
    SetUserData(2, 99)
done

def func_5()
    SetTurnMode(2)
done

def func_6()
    -- placeholder, TODO:
done

def func_7()
    -- backyard put in, #1
    Sleep(2)
    SetCtrlMode(2)
    SetTurnMode(5)
    SetDirection(1)
    SetCtrlMode(1)
    SetButton(1)
    func_1()
    Sleep(<%= delay_short %>)
    SelectSpeedLevel(1)
    SetButton(0)
done

def func_8()
    -- backyard put in, #2 (w/ 180 deg turn)
    Sleep(2)
    SetCtrlMode(2)
    SetTurnMode(6)
    Sleep(1)
    SetTurnMode(6)
    SetDirection(1)
    SetCtrlMode(1)
    SetButton(1)
    func_1()
    Sleep(<%= delay_short %>)
    SelectSpeedLevel(1)
    SetButton(0)
done

def func_9()
    -- install put in, enter
    Sleep(2)
    SetCtrlMode(2)
    SetTurnMode(3)
    SetDirection(0)
    SetCtrlMode(1)
    Sleep(3)
    SetButton(1)
    func_1()
    Sleep(<%= delay %>)
    SelectSpeedLevel(1)
    SetButton(0)
done

def func_10()
    -- install put in, leave
    SetDirection(0)
    SetCtrlMode(1)
    Sleep(2)
    SetCtrlMode(2)
    SetTurnMode(5)
    SetDirection(0)
    SetCtrlMode(1)
done

def func_11()
    -- backyard pick up, #1
    Sleep(2)
    SetCtrlMode(2)
    SetTurnMode(5)
    SetDirection(1)
    SelectSpeedLevel(1)
    SetCtrlMode(1)
done

def func_12()
    -- backyard pick up, #2 (w/ 180 deg turn)
    Sleep(2)
    SetCtrlMode(2)
    SetTurnMode(6)
    Sleep(1)
    SetTurnMode(6)
    SetDirection(1)
    SelectSpeedLevel(1)
    SetCtrlMode(1)
done

def func_13()
    -- uninstall pick up, enter
    Sleep(2)
    SetCtrlMode(2)
    SetTurnMode(3)
    SetDirection(0)
    SetCtrlMode(1)
    Sleep(3)
    SelectSpeedLevel(1)
done

def func_14()
    -- aux, for task 1 & 5, 90deg turn
    SetDirection(0)
    SetCtrlMode(1)
    Sleep(2)
    SetCtrlMode(2)
    SetTurnMode(3)
    SetDirection(0)
    SetCtrlMode(1)
done
