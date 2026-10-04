import { expect,it } from 'vitest';
import { versioned } from './versioning';
it('uses the authoritative body version and preserves BIGINT identifiers',()=>{
 const value={id:'9007199254740993',version:7};
 expect(versioned(value)).toEqual({value,etag:'"v7"'});
 expect(()=>versioned({version:NaN})).toThrow();
 expect(()=>versioned({version:0})).toThrow();
});
it('accepts the initial v0 only when the contract explicitly permits it',()=>{
 expect(versioned({version:0},{allowInitialZero:true}).etag).toBe('"v0"');
 expect(()=>versioned({version:-1},{allowInitialZero:true})).toThrow();
 expect(()=>versioned({version:NaN},{allowInitialZero:true})).toThrow();
});
