import { describe, expect, it } from 'vitest';
import * as publicApi from '../index';

describe('public export surface', () => {
  it('exports core HeartStamp components from the package root', () => {
    expect(publicApi.Btn).toBeTypeOf('function');
    expect(publicApi.Inp).toBeTypeOf('function');
    expect(publicApi.Crd).toBeTypeOf('function');
    expect(publicApi.Bdg).toBeTypeOf('function');
    expect(publicApi.HSLogo).toBeTypeOf('function');
    expect(publicApi.TopNavDesktop).toBeTypeOf('function');
    expect(publicApi.TopNavMobile).toBeTypeOf('function');
  });
});
