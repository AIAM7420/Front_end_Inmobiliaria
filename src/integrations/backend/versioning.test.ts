import { expect,it } from 'vitest';
import { versioned } from './versioning';
it('uses the authoritative body version and preserves BIGINT identifiers',()=>{
 const value={id:'9007199254740993',version:7};
 expect(versioned(value)).toEqual({value,etag:'"v7"'});
 expect(()=>versioned({version:NaN})).toThrow();
 expect(()=>versioned({version:0})).toThrow();
});
