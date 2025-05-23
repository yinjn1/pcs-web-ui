import type {AppReducer} from "app/store/reducers/appReducer";

import {initialState as initialLibCall, libCall} from "./libCall";

type InstanceAttrName = string;
type InstanceAttrValue = string;
type InstanceAttrs = Record<InstanceAttrName, InstanceAttrValue>;

const initialState: {
  clusterName: string;
  agentName: string;
  fenceDeviceName: string;
  instanceAttrs: InstanceAttrs;
  libCall: typeof initialLibCall;
  showValidationErrors: boolean;
  disabled: boolean;
} = {
  clusterName: "",
  fenceDeviceName: "",
  agentName: "",
  libCall: initialLibCall,
  instanceAttrs: {},
  showValidationErrors: false,
  disabled: false,
};

const instanceAttrs = (stateAttrs: InstanceAttrs, actionAttrs: InstanceAttrs) =>
  Object.keys(actionAttrs).reduce((attrs, name) => {
    if (actionAttrs[name].length > 0) {
      return {...attrs, [name]: actionAttrs[name]};
    }
    const {[name]: _, ...rest} = stateAttrs;
    return rest;
  }, stateAttrs);

export const fenceDeviceCreate: AppReducer<typeof initialState> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case "FENCE_DEVICE.CREATE.INIT":
      return {
        ...state,
        clusterName: action.payload.clusterName,
      };
    case "FENCE_DEVICE.CREATE.UPDATE": {
      const removeInstanceAttrs =
        "instanceAttrs" in action.payload &&
        action.payload.instanceAttrs &&
        Object.keys(action.payload.instanceAttrs).length === 0;

      return {
        ...state,
        ...action.payload,
        instanceAttrs: removeInstanceAttrs
          ? {}
          : instanceAttrs(
              state.instanceAttrs,
              action.payload.instanceAttrs || {},
            ),
      };
    }

    case "FENCE_DEVICE.CREATE.CLOSE":
      return initialState;

    case "TASK.VALIDATION.SHOW":
      return {...state, showValidationErrors: true};

    case "TASK.VALIDATION.HIDE":
      return {...state, showValidationErrors: false};

    default:
      return {...state, libCall: libCall(state.libCall, action)};
  }
};
