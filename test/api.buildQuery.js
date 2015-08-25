import expect from 'expect';
import { buildQuery } from '../src/constants/stn';

describe('api.buildQuery', () => {
  describe('Temp annual grid query', () => {

    let params = {
      chart: 'Temp',
      geom: 'county',
      element: 'maxt',
      season: 'ANN',
      sid: '',
      bbox: ''
    };

    let q = buildQuery(params, {});

    it('should match query', () => {
      expect(q).toEqual({
        grid: 21,
        sdate: [1895],
        edate: [2015],
        state: 'ny',
        elems: [{
          vX: 95,
          vN: 0,
          interval: [1],
          duration: 1,
          reduce: 'mean',
          maxmissing: 30,
          area_reduce: 'county_mean'
        }]
      });
    });

    it('should handle basin', () => {
      q = buildQuery({...params, geom: 'basin'},{});
      expect(q.elems[0].area_reduce).toBe('basin_mean');
      expect(q.state).toBe('oh,nj,me');
    });

    it('should handle state', () => {
      q = buildQuery({...params, geom: 'state'},{});
      expect(q.elems[0].area_reduce).toBe('state_mean');
      expect(q.state).toBe('pa,nj,nh,ma');
    });

    it('should handle mint', () => {
      q = buildQuery({...params, element: 'mint'},{});
      expect(q.elems[0].vX).toBe(96);
    });

    it('should handle avgt', () => {
      q = buildQuery({...params, element: 'avgt'},{});
      expect(q.elems[0].vX).toBe(100);
    });

  });

  describe('DegDay annual grid query', () => {

    let params = {
      chart: 'Temp',
      geom: 'county',
      element: 'gdd50',
      season: 'ANN',
      sid: '',
      bbox: ''
    };

    let q = buildQuery(params, {});

    it('should match query', () => {
      expect(q).toEqual({
        grid: 21,
        sdate: [1981],
        edate: [2015],
        state: 'ny',
        elems: [{
          vX: 44,
          vN: 0,
          base: 50,
          interval: [1],
          duration: 1,
          reduce: 'sum',
          maxmissing: 30,
          area_reduce: 'county_mean'
        }]
      });
    });

    it('should handle basin', () => {
      q = buildQuery({...params, geom: 'basin'},{});
      expect(q.elems[0].area_reduce).toBe('basin_mean');
      expect(q.state).toBe('oh,nj,me');
    });

    it('should handle state', () => {
      q = buildQuery({...params, geom: 'state'},{});
      expect(q.elems[0].area_reduce).toBe('state_mean');
      expect(q.state).toBe('pa,nj,nh,ma');
    });

    it('should handle hdd', () => {
      q = buildQuery({...params, element: 'hdd65'},{});
      expect(q.elems[0].vX).toBe(45);
      expect(q.elems[0].base).toBe(65);
    });

    it('should handle cdd', () => {
      q = buildQuery({...params, element: 'cdd65'},{});
      expect(q.elems[0].vX).toBe(44);
      expect(q.elems[0].base).toBe(65);
    });

  });

  describe('Temp month/season grid query', () => {

    let params = {
      chart: 'Temp',
      geom: 'county',
      element: 'maxt',
      season: 'Feb',
      sid: '',
      bbox: ''
    };

    let q = buildQuery(params, {});

    it('should match Feb query', () => {
      expect(q).toEqual({
        grid: 21,
        sdate: [1895,2],
        edate: [2015,2],
        state: 'ny',
        elems: [{
          vX: 91,
          vN: 0,
          interval: [1,0],
          duration: 1,
          reduce: 'mean',
          maxmissing: 3,
          area_reduce: 'county_mean'
        }]
      });
    });

    it('should handle Nov', () => {
      q = buildQuery({...params, season: 'Nov'},{});
      expect(q.sdate).toEqual([1895,11]);
      expect(q.edate).toEqual([2015,11]);
    });

    it('should handle MAM', () => {
      q = buildQuery({...params, season: 'MAM'},{});
      expect(q.sdate).toEqual([1895,5]);
      expect(q.edate).toEqual([2015,5]);
      expect(q.elems[0].duration).toBe(3);
      expect(q.elems[0].maxmissing).toBe(10);
    });

    it('should handle JJA', () => {
      q = buildQuery({...params, season: 'JJA'},{});
      expect(q.sdate).toEqual([1895,8]);
      expect(q.edate).toEqual([2015,8]);
      expect(q.elems[0].duration).toBe(3);
      expect(q.elems[0].maxmissing).toBe(10);
    });

    it('should handle SON', () => {
      q = buildQuery({...params, season: 'SON'},{});
      expect(q.sdate).toEqual([1895,11]);
      expect(q.edate).toEqual([2015,11]);
      expect(q.elems[0].duration).toBe(3);
      expect(q.elems[0].maxmissing).toBe(10);
    });

    it('should handle DJF', () => {
      q = buildQuery({...params, season: 'DJF'},{});
      expect(q.sdate).toEqual([1895,2]);
      expect(q.edate).toEqual([2015,2]);
      expect(q.elems[0].duration).toBe(3);
      expect(q.elems[0].maxmissing).toBe(10);
    });

  });

});

