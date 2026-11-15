
import {
  describe, //groups related tests together
  it, //defines one individual test
  expect, //checks whether something matches the expected result
  vi, //provides utilities for mocking functions and controlling time
  beforeEach, //runs setup code before every test
  afterEach, //runs cleanup code after every test
} from "vitest";

import { PatienceMeter } from "../../customer/CustomerModel";

describe("PatienceMeter", () => {

  // use fake timers so tests run without waiting 60 secs
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.clearAllTimers(); //removes any timers that are still scheduled after the test finishes
    vi.useRealTimers(); //restores the normal timer behavior
  });

  // test 1: patience decreases over time
  it("decreases patience correctly over time", () => {
    //mock functions
    const onUpdate = vi.fn();
    const onExpired = vi.fn();

    //create patience meter that starts with 60 secs
    const meter = new PatienceMeter(60, onUpdate, onExpired);

    meter.start();

    // simulate 15 seconds passing
    vi.advanceTimersByTime(15000);

    //check whether 45 seconds (75%) remain
    expect(onUpdate).toHaveBeenLastCalledWith(45, 75);
    expect(onExpired).not.toHaveBeenCalled();

    // simulate another 15 seconds
    vi.advanceTimersByTime(15000);

    //check whether 30 secs (50%) remain
    expect(onUpdate).toHaveBeenLastCalledWith(30, 50);
  });

  // test 2: patience reaches zero
  it("triggers expiration when time runs out", () => {
    const onUpdate = vi.fn();
    const onExpired = vi.fn();

    const meter = new PatienceMeter(60, onUpdate, onExpired);

    meter.start();

    // simulate the full 60 seconds
    vi.advanceTimersByTime(60000);

    //should report 0 seconds and 0% patience
    expect(onUpdate).toHaveBeenLastCalledWith(0, 0);
    //expiration should only be called once
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  // test 3: expiration only happens once
  it("does not trigger expiration multiple times", () => {
    const onUpdate = vi.fn();
    const onExpired = vi.fn();

    const meter = new PatienceMeter(60, onUpdate, onExpired);

    meter.start();

    // simulate 70 seconds
    vi.advanceTimersByTime(70000);

    //expiration should only be called once
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  // test 4: stopping the timer
  it("stops decreasing patience when stop is called", () => {
    const onUpdate = vi.fn();
    const onExpired = vi.fn();

    const meter = new PatienceMeter(60, onUpdate, onExpired);

    meter.start();

    //simulate 10 seconds passed
    vi.advanceTimersByTime(10000);

    meter.stop();

    //record how any times onUpdate was called before stopping
    const callsBefore = onUpdate.mock.calls.length;

    // simulate more time after stopping
    vi.advanceTimersByTime(60000);

    expect(onUpdate).toHaveBeenCalledTimes(callsBefore);
    expect(onExpired).not.toHaveBeenCalled();
  });

  // test 5: reset restores full patience
  it("resets patience back to 100 percent", () => {
    const onUpdate = vi.fn();
    const onExpired = vi.fn();

    const meter = new PatienceMeter(60, onUpdate, onExpired);

    meter.start();

    vi.advanceTimersByTime(30000);

    meter.reset();

    //after reset call, there should be 60 secs on the timer and 100% patience
    expect(onUpdate).toHaveBeenLastCalledWith(60, 100);
    //expired should have not been called yet
    expect(onExpired).not.toHaveBeenCalled();
  });

  // test 6: starting twice does not create duplicate timers
  it("prevents multiple timers from starting", () => {
    const onUpdate = vi.fn();
    const onExpired = vi.fn();

    const meter = new PatienceMeter(60, onUpdate, onExpired);

    meter.start();
    meter.start();

    // only one scheduled (fake) timer should exist
    expect(vi.getTimerCount()).toBe(1);

    vi.advanceTimersByTime(60000);

    //expiration should only be called once
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  // test 7: reset allows timer to restart
  it("can restart after resetting", () => {
    const onUpdate = vi.fn();
    const onExpired = vi.fn();

    const meter = new PatienceMeter(60, onUpdate, onExpired);

    meter.start();

    //advance 30 secs
    vi.advanceTimersByTime(30000);

    meter.reset();
    //restart countdown
    meter.start();
    //advance another 10 secs
    vi.advanceTimersByTime(10000);

    //expect 50 secs remaining with ~83.333% patience
    expect(onUpdate).toHaveBeenLastCalledWith(
      50,
      (50 / 60) * 100
    );

    expect(onExpired).not.toHaveBeenCalled();
  });

});
