//  t = textbox, c = checkbox, dd = dropwdown, r = radio.  e.g. firstName:t,lastName:t,subscribe:c,preferences:dd
export interface ControlType {
  type: 't' | 'c' | 'r' | 'dd';
  inputName: string;
};
