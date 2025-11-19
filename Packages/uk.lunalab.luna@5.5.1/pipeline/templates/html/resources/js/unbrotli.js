// In order to produce unbrotli.min.js:
// 1. Run "google-closure-compiler --js=./pipeline/templates/html/resources/js/unbrotli.js --js_output_file=./pipeline/templates/html/resources/js/unbrotli.min.js --compilation_level=ADVANCED"
// 2. Build any project for any network that uses compression
// 3. Execute "window.makeBrotliDecode.toString()" in console and copy the text
// 4. Paste it into unbrotli.min.js and prepend "window.makeBrotliDecodeStr="

/* Copyright 2017 Google Inc. All Rights Reserved.

   Distributed under MIT license.
   See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
*/

{
    /**
      * Private scope / static initializer for decoder.
      *
      * @return {function(!Int8Array):!Int8Array}
      */
    const makeBrotliDecode = () => {
        /**
        * @constructor
        * @param {!Int8Array} bytes
        * @struct
        */
        function InputStream( bytes ) {
            /** @type {!Int8Array} */
            this.data = bytes;
            /** @type {!number} */
            this.offset = 0;
        }

        /* GENERATED CODE BEGIN */
        /** @type {!Int32Array} */
        const MAX_HUFFMAN_TABLE_SIZE = Int32Array.from( [ 256, 402, 436, 468, 500, 534, 566, 598, 630, 662, 694, 726, 758, 790, 822, 854, 886, 920, 952, 984, 1016, 1048, 1080 ] );
        /** @type {!Int32Array} */
        const CODE_LENGTH_CODE_ORDER = Int32Array.from( [ 1, 2, 3, 4, 0, 5, 17, 6, 16, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] );
        /** @type {!Int32Array} */
        const DISTANCE_SHORT_CODE_INDEX_OFFSET = Int32Array.from( [ 0, 3, 2, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3 ] );
        /** @type {!Int32Array} */
        const DISTANCE_SHORT_CODE_VALUE_OFFSET = Int32Array.from( [ 0, 0, 0, 0, -1, 1, -2, 2, -3, 3, -1, 1, -2, 2, -3, 3 ] );
        /** @type {!Int32Array} */
        const FIXED_TABLE = Int32Array.from( [ 0x020000, 0x020004, 0x020003, 0x030002, 0x020000, 0x020004, 0x020003, 0x040001, 0x020000, 0x020004, 0x020003, 0x030002, 0x020000, 0x020004, 0x020003, 0x040005 ] );
        /** @type {!Int32Array} */
        const BLOCK_LENGTH_OFFSET = Int32Array.from( [ 1, 5, 9, 13, 17, 25, 33, 41, 49, 65, 81, 97, 113, 145, 177, 209, 241, 305, 369, 497, 753, 1265, 2289, 4337, 8433, 16625 ] );
        /** @type {!Int32Array} */
        const BLOCK_LENGTH_N_BITS = Int32Array.from( [ 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 7, 8, 9, 10, 11, 12, 13, 24 ] );
        /** @type {!Int16Array} */
        const INSERT_LENGTH_N_BITS = Int16Array.from( [ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x02, 0x02, 0x03, 0x03, 0x04, 0x04, 0x05, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0C, 0x0E, 0x18 ] );
        /** @type {!Int16Array} */
        const COPY_LENGTH_N_BITS = Int16Array.from( [ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x02, 0x02, 0x03, 0x03, 0x04, 0x04, 0x05, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x18 ] );
        /** @type {!Int16Array} */
        const CMD_LOOKUP = new Int16Array( 2816 );
        {
            unpackCommandLookupTable( CMD_LOOKUP );
        }
        /**
        * @param {number} i
        * @return {number}
        */
        function log2floor( i ) {
            let /** @type{number} */ result = -1;
            let /** @type{number} */ step = 16;
            while ( step > 0 ) {
                if ( ( i >>> step ) != 0 ) {
                    result += step;
                    i >>>= step;
                }
                step >>= 1;
            }
            return result + i;
        }
        /**
        * @param {number} npostfix
        * @param {number} ndirect
        * @param {number} maxndistbits
        * @return {number}
        */
        function calculateDistanceAlphabetSize( npostfix, ndirect, maxndistbits ) {
            return 16 + ndirect + 2 * ( maxndistbits << npostfix );
        }
        /**
        * @param {number} maxDistance
        * @param {number} npostfix
        * @param {number} ndirect
        * @return {number}
        */
        function calculateDistanceAlphabetLimit( maxDistance, npostfix, ndirect ) {
            const /** @type{number} */ offset = ( ( maxDistance - ndirect ) >> npostfix ) + 4;
            const /** @type{number} */ ndistbits = log2floor( offset ) - 1;
            const /** @type{number} */ group = ( ( ndistbits - 1 ) << 1 ) | ( ( offset >> ndistbits ) & 1 );
            return ( ( group - 1 ) << npostfix ) + ( 1 << npostfix ) + ndirect + 16;
        }
        /**
        * @param {!Int16Array} cmdLookup
        * @return {void}
        */
        function unpackCommandLookupTable( cmdLookup ) {
            const /** @type{!Int16Array} */ insertLengthOffsets = new Int16Array( 24 );
            const /** @type{!Int16Array} */ copyLengthOffsets = new Int16Array( 24 );
            copyLengthOffsets[ 0 ] = 2;
            for ( let /** @type{number} */ i = 0; i < 23; ++i ) {
                insertLengthOffsets[ i + 1 ] = ( insertLengthOffsets[ i ] + ( 1 << INSERT_LENGTH_N_BITS[ i ] ) );
                copyLengthOffsets[ i + 1 ] = ( copyLengthOffsets[ i ] + ( 1 << COPY_LENGTH_N_BITS[ i ] ) );
            }
            for ( let /** @type{number} */ cmdCode = 0; cmdCode < 704; ++cmdCode ) {
                let /** @type{number} */ rangeIdx = cmdCode >>> 6;
                let /** @type{number} */ distanceContextOffset = -4;
                if ( rangeIdx >= 2 ) {
                    rangeIdx -= 2;
                    distanceContextOffset = 0;
                }
                const /** @type{number} */ insertCode = ( ( ( 0x29850 >>> ( rangeIdx * 2 ) ) & 0x3 ) << 3 ) | ( ( cmdCode >>> 3 ) & 7 );
                const /** @type{number} */ copyCode = ( ( ( 0x26244 >>> ( rangeIdx * 2 ) ) & 0x3 ) << 3 ) | ( cmdCode & 7 );
                const /** @type{number} */ copyLengthOffset = copyLengthOffsets[ copyCode ];
                const /** @type{number} */ distanceContext = distanceContextOffset + ( copyLengthOffset > 4 ? 3 : copyLengthOffset - 2 );
                const /** @type{number} */ index = cmdCode * 4;
                cmdLookup[ index + 0 ] = ( INSERT_LENGTH_N_BITS[ insertCode ] | ( COPY_LENGTH_N_BITS[ copyCode ] << 8 ) );
                cmdLookup[ index + 1 ] = insertLengthOffsets[ insertCode ];
                cmdLookup[ index + 2 ] = copyLengthOffsets[ copyCode ];
                cmdLookup[ index + 3 ] = distanceContext;
            }
        }
        /**
        * @param {!State} s
        * @return {number}
        */
        function decodeWindowBits( s ) {
            const /** @type{number} */ largeWindowEnabled = s.isLargeWindow;
            s.isLargeWindow = 0;
            if ( s.bitOffset >= 16 ) {
                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                s.bitOffset -= 16;
            }
            if ( readFewBits( s, 1 ) == 0 ) {
                return 16;
            }
            let /** @type{number} */ n = readFewBits( s, 3 );
            if ( n != 0 ) {
                return 17 + n;
            }
            n = readFewBits( s, 3 );
            if ( n != 0 ) {
                if ( n == 1 ) {
                    if ( largeWindowEnabled == 0 ) {
                        return -1;
                    }
                    s.isLargeWindow = 1;
                    if ( readFewBits( s, 1 ) == 1 ) {
                        return -1;
                    }
                    n = readFewBits( s, 6 );
                    if ( n < 10 || n > 30 ) {
                        return -1;
                    }
                    return n;
                } else {
                    return 8 + n;
                }
            }
            return 17;
        }
        /**
        * @param {!State} s
        * @param {!InputStream} input
        * @return {void}
        */
        function initState( s, input ) {
            s.blockTrees = new Int32Array( 3091 );
            s.blockTrees[ 0 ] = 7;
            s.distRbIdx = 3;
            const /** @type{number} */ maxDistanceAlphabetLimit = calculateDistanceAlphabetLimit( 0x7FFFFFFC, 3, 15 << 3 );
            s.distExtraBits = new Int8Array( maxDistanceAlphabetLimit );
            s.distOffset = new Int32Array( maxDistanceAlphabetLimit );
            s.input = input;
            initBitReader( s );
            s.runningState = 1;
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function close( s ) {
            if ( s.runningState == 11 ) {
                return;
            }
            s.runningState = 11;
            if ( s.input != null ) {
                closeInput( s.input );
                s.input = null;
            }
        }
        /**
        * @param {!State} s
        * @return {number}
        */
        function decodeVarLenUnsignedByte( s ) {
            if ( s.bitOffset >= 16 ) {
                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                s.bitOffset -= 16;
            }
            if ( readFewBits( s, 1 ) != 0 ) {
                const /** @type{number} */ n = readFewBits( s, 3 );
                if ( n == 0 ) {
                    return 1;
                } else {
                    return readFewBits( s, n ) + ( 1 << n );
                }
            }
            return 0;
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function decodeMetaBlockLength( s ) {
            if ( s.bitOffset >= 16 ) {
                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                s.bitOffset -= 16;
            }
            s.inputEnd = readFewBits( s, 1 );
            s.metaBlockLength = 0;
            s.isUncompressed = 0;
            s.isMetadata = 0;
            if ( ( s.inputEnd != 0 ) && readFewBits( s, 1 ) != 0 ) {
                return;
            }
            const /** @type{number} */ sizeNibbles = readFewBits( s, 2 ) + 4;
            if ( sizeNibbles == 7 ) {
                s.isMetadata = 1;
                readFewBits( s, 1 )
                const /** @type{number} */ sizeBytes = readFewBits( s, 2 );
                if ( sizeBytes == 0 ) {
                    return;
                }
                for ( let /** @type{number} */ i = 0; i < sizeBytes; i++ ) {
                    if ( s.bitOffset >= 16 ) {
                        s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                        s.bitOffset -= 16;
                    }
                    const /** @type{number} */ bits = readFewBits( s, 8 );
                    s.metaBlockLength |= bits << ( i * 8 );
                }
            } else {
                for ( let /** @type{number} */ i = 0; i < sizeNibbles; i++ ) {
                    if ( s.bitOffset >= 16 ) {
                        s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                        s.bitOffset -= 16;
                    }
                    const /** @type{number} */ bits = readFewBits( s, 4 );
                    s.metaBlockLength |= bits << ( i * 4 );
                }
            }
            s.metaBlockLength++;
            if ( s.inputEnd == 0 ) {
                s.isUncompressed = readFewBits( s, 1 );
            }
        }
        /**
        * @param {!Int32Array} tableGroup
        * @param {number} tableIdx
        * @param {!State} s
        * @return {number}
        */
        function readSymbol( tableGroup, tableIdx, s ) {
            let /** @type{number} */ offset = tableGroup[ tableIdx ];
            const /** @type{number} */ val = ( s.accumulator32 >>> s.bitOffset );
            offset += val & 0xFF;
            const /** @type{number} */ bits = tableGroup[ offset ] >> 16;
            const /** @type{number} */ sym = tableGroup[ offset ] & 0xFFFF;
            if ( bits <= 8 ) {
                s.bitOffset += bits;
                return sym;
            }
            offset += sym;
            const /** @type{number} */ mask = ( 1 << bits ) - 1;
            offset += ( val & mask ) >>> 8;
            s.bitOffset += ( ( tableGroup[ offset ] >> 16 ) + 8 );
            return tableGroup[ offset ] & 0xFFFF;
        }
        /**
        * @param {!Int32Array} tableGroup
        * @param {number} tableIdx
        * @param {!State} s
        * @return {number}
        */
        function readBlockLength( tableGroup, tableIdx, s ) {
            if ( s.bitOffset >= 16 ) {
                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                s.bitOffset -= 16;
            }
            const /** @type{number} */ code = readSymbol( tableGroup, tableIdx, s );
            const /** @type{number} */ n = BLOCK_LENGTH_N_BITS[ code ];
            if ( s.bitOffset >= 16 ) {
                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                s.bitOffset -= 16;
            }
            return BLOCK_LENGTH_OFFSET[ code ] + ( ( n <= 16 ) ? readFewBits( s, n ) : readManyBits( s, n ) );
        }
        /**
        * @param {!Int32Array} v
        * @param {number} index
        * @return {void}
        */
        function moveToFront( v, index ) {
            const /** @type{number} */ value = v[ index ];
            for ( ; index > 0; index-- ) {
                v[ index ] = v[ index - 1 ];
            }
            v[ 0 ] = value;
        }
        /**
        * @param {!Int8Array} v
        * @param {number} vLen
        * @return {void}
        */
        function inverseMoveToFrontTransform( v, vLen ) {
            const /** @type{!Int32Array} */ mtf = new Int32Array( 256 );
            for ( let /** @type{number} */ i = 0; i < 256; i++ ) {
                mtf[ i ] = i;
            }
            for ( let /** @type{number} */ i = 0; i < vLen; i++ ) {
                const /** @type{number} */ index = v[ i ] & 0xFF;
                v[ i ] = mtf[ index ];
                if ( index != 0 ) {
                    moveToFront( mtf, index );
                }
            }
        }
        /**
        * @param {!Int32Array} codeLengthCodeLengths
        * @param {number} numSymbols
        * @param {!Int32Array} codeLengths
        * @param {!State} s
        * @return {void}
        */
        function readHuffmanCodeLengths( codeLengthCodeLengths, numSymbols, codeLengths, s ) {
            let /** @type{number} */ symbol = 0;
            let /** @type{number} */ prevCodeLen = 8;
            let /** @type{number} */ repeat = 0;
            let /** @type{number} */ repeatCodeLen = 0;
            let /** @type{number} */ space = 32768;
            const /** @type{!Int32Array} */ table = new Int32Array( 32 + 1 );
            const /** @type{number} */ tableIdx = table.length - 1;
            buildHuffmanTable( table, tableIdx, 5, codeLengthCodeLengths, 18 );
            while ( symbol < numSymbols && space > 0 ) {
                if ( s.halfOffset > 2030 ) {
                    doReadMoreInput( s );
                }
                if ( s.bitOffset >= 16 ) {
                    s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                    s.bitOffset -= 16;
                }
                const /** @type{number} */ p = ( s.accumulator32 >>> s.bitOffset ) & 31;
                s.bitOffset += table[ p ] >> 16;
                const /** @type{number} */ codeLen = table[ p ] & 0xFFFF;
                if ( codeLen < 16 ) {
                    repeat = 0;
                    codeLengths[ symbol++ ] = codeLen;
                    if ( codeLen != 0 ) {
                        prevCodeLen = codeLen;
                        space -= 32768 >> codeLen;
                    }
                } else {
                    const /** @type{number} */ extraBits = codeLen - 14;
                    let /** @type{number} */ newLen = 0;
                    if ( codeLen == 16 ) {
                        newLen = prevCodeLen;
                    }
                    if ( repeatCodeLen != newLen ) {
                        repeat = 0;
                        repeatCodeLen = newLen;
                    }
                    const /** @type{number} */ oldRepeat = repeat;
                    if ( repeat > 0 ) {
                        repeat -= 2;
                        repeat <<= extraBits;
                    }
                    if ( s.bitOffset >= 16 ) {
                        s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                        s.bitOffset -= 16;
                    }
                    repeat += readFewBits( s, extraBits ) + 3;
                    const /** @type{number} */ repeatDelta = repeat - oldRepeat;
                    for ( let /** @type{number} */ i = 0; i < repeatDelta; i++ ) {
                        codeLengths[ symbol++ ] = repeatCodeLen;
                    }
                    if ( repeatCodeLen != 0 ) {
                        space -= repeatDelta << ( 15 - repeatCodeLen );
                    }
                }
            }
            codeLengths.fill( 0, symbol, numSymbols );
        }
        /**
        * @param {number} alphabetSizeMax
        * @param {number} alphabetSizeLimit
        * @param {!Int32Array} tableGroup
        * @param {number} tableIdx
        * @param {!State} s
        * @return {number}
        */
        function readSimpleHuffmanCode( alphabetSizeMax, alphabetSizeLimit, tableGroup, tableIdx, s ) {
            const /** @type{!Int32Array} */ codeLengths = new Int32Array( alphabetSizeLimit );
            const /** @type{!Int32Array} */ symbols = new Int32Array( 4 );
            const /** @type{number} */ maxBits = 1 + log2floor( alphabetSizeMax - 1 );
            const /** @type{number} */ numSymbols = readFewBits( s, 2 ) + 1;
            for ( let /** @type{number} */ i = 0; i < numSymbols; i++ ) {
                if ( s.bitOffset >= 16 ) {
                    s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                    s.bitOffset -= 16;
                }
                const /** @type{number} */ symbol = readFewBits( s, maxBits );
                symbols[ i ] = symbol;
            }
            let /** @type{number} */ histogramId = numSymbols;
            if ( numSymbols == 4 ) {
                histogramId += readFewBits( s, 1 );
            }
            switch ( histogramId ) {
                case 1:
                    codeLengths[ symbols[ 0 ] ] = 1;
                    break;
                case 2:
                    codeLengths[ symbols[ 0 ] ] = 1;
                    codeLengths[ symbols[ 1 ] ] = 1;
                    break;
                case 3:
                    codeLengths[ symbols[ 0 ] ] = 1;
                    codeLengths[ symbols[ 1 ] ] = 2;
                    codeLengths[ symbols[ 2 ] ] = 2;
                    break;
                case 4:
                    codeLengths[ symbols[ 0 ] ] = 2;
                    codeLengths[ symbols[ 1 ] ] = 2;
                    codeLengths[ symbols[ 2 ] ] = 2;
                    codeLengths[ symbols[ 3 ] ] = 2;
                    break;
                case 5:
                    codeLengths[ symbols[ 0 ] ] = 1;
                    codeLengths[ symbols[ 1 ] ] = 2;
                    codeLengths[ symbols[ 2 ] ] = 3;
                    codeLengths[ symbols[ 3 ] ] = 3;
                    break;
                default:
                    break;
            }
            return buildHuffmanTable( tableGroup, tableIdx, 8, codeLengths, alphabetSizeLimit );
        }
        /**
        * @param {number} alphabetSizeLimit
        * @param {number} skip
        * @param {!Int32Array} tableGroup
        * @param {number} tableIdx
        * @param {!State} s
        * @return {number}
        */
        function readComplexHuffmanCode( alphabetSizeLimit, skip, tableGroup, tableIdx, s ) {
            const /** @type{!Int32Array} */ codeLengths = new Int32Array( alphabetSizeLimit );
            const /** @type{!Int32Array} */ codeLengthCodeLengths = new Int32Array( 18 );
            let /** @type{number} */ space = 32;
            let /** @type{number} */ numCodes = 0;
            for ( let /** @type{number} */ i = skip; i < 18 && space > 0; i++ ) {
                const /** @type{number} */ codeLenIdx = CODE_LENGTH_CODE_ORDER[ i ];
                if ( s.bitOffset >= 16 ) {
                    s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                    s.bitOffset -= 16;
                }
                const /** @type{number} */ p = ( s.accumulator32 >>> s.bitOffset ) & 15;
                s.bitOffset += FIXED_TABLE[ p ] >> 16;
                const /** @type{number} */ v = FIXED_TABLE[ p ] & 0xFFFF;
                codeLengthCodeLengths[ codeLenIdx ] = v;
                if ( v != 0 ) {
                    space -= ( 32 >> v );
                    numCodes++;
                }
            }
            readHuffmanCodeLengths( codeLengthCodeLengths, alphabetSizeLimit, codeLengths, s );
            return buildHuffmanTable( tableGroup, tableIdx, 8, codeLengths, alphabetSizeLimit );
        }
        /**
        * @param {number} alphabetSizeMax
        * @param {number} alphabetSizeLimit
        * @param {!Int32Array} tableGroup
        * @param {number} tableIdx
        * @param {!State} s
        * @return {number}
        */
        function readHuffmanCode( alphabetSizeMax, alphabetSizeLimit, tableGroup, tableIdx, s ) {
            if ( s.halfOffset > 2030 ) {
                doReadMoreInput( s );
            }
            if ( s.bitOffset >= 16 ) {
                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                s.bitOffset -= 16;
            }
            const /** @type{number} */ simpleCodeOrSkip = readFewBits( s, 2 );
            if ( simpleCodeOrSkip == 1 ) {
                return readSimpleHuffmanCode( alphabetSizeMax, alphabetSizeLimit, tableGroup, tableIdx, s );
            } else {
                return readComplexHuffmanCode( alphabetSizeLimit, simpleCodeOrSkip, tableGroup, tableIdx, s );
            }
        }
        /**
        * @param {number} contextMapSize
        * @param {!Int8Array} contextMap
        * @param {!State} s
        * @return {number}
        */
        function decodeContextMap( contextMapSize, contextMap, s ) {
            if ( s.halfOffset > 2030 ) {
                doReadMoreInput( s );
            }
            const /** @type{number} */ numTrees = decodeVarLenUnsignedByte( s ) + 1;
            if ( numTrees == 1 ) {
                contextMap.fill( 0, 0, contextMapSize );
                return numTrees;
            }
            if ( s.bitOffset >= 16 ) {
                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                s.bitOffset -= 16;
            }
            const /** @type{number} */ useRleForZeros = readFewBits( s, 1 );
            let /** @type{number} */ maxRunLengthPrefix = 0;
            if ( useRleForZeros != 0 ) {
                maxRunLengthPrefix = readFewBits( s, 4 ) + 1;
            }
            const /** @type{number} */ alphabetSize = numTrees + maxRunLengthPrefix;
            const /** @type{number} */ tableSize = MAX_HUFFMAN_TABLE_SIZE[ ( alphabetSize + 31 ) >> 5 ];
            const /** @type{!Int32Array} */ table = new Int32Array( tableSize + 1 );
            const /** @type{number} */ tableIdx = table.length - 1;
            readHuffmanCode( alphabetSize, alphabetSize, table, tableIdx, s );
            for ( let /** @type{number} */ i = 0; i < contextMapSize; ) {
                if ( s.halfOffset > 2030 ) {
                    doReadMoreInput( s );
                }
                if ( s.bitOffset >= 16 ) {
                    s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                    s.bitOffset -= 16;
                }
                const /** @type{number} */ code = readSymbol( table, tableIdx, s );
                if ( code == 0 ) {
                    contextMap[ i ] = 0;
                    i++;
                } else if ( code <= maxRunLengthPrefix ) {
                    if ( s.bitOffset >= 16 ) {
                        s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                        s.bitOffset -= 16;
                    }
                    let /** @type{number} */ reps = ( 1 << code ) + readFewBits( s, code );
                    while ( reps != 0 ) {
                        contextMap[ i ] = 0;
                        i++;
                        reps--;
                    }
                } else {
                    contextMap[ i ] = ( code - maxRunLengthPrefix );
                    i++;
                }
            }
            if ( s.bitOffset >= 16 ) {
                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                s.bitOffset -= 16;
            }
            if ( readFewBits( s, 1 ) == 1 ) {
                inverseMoveToFrontTransform( contextMap, contextMapSize );
            }
            return numTrees;
        }
        /**
        * @param {!State} s
        * @param {number} treeType
        * @param {number} numBlockTypes
        * @return {number}
        */
        function decodeBlockTypeAndLength( s, treeType, numBlockTypes ) {
            const /** @type{!Int32Array} */ ringBuffers = s.rings;
            const /** @type{number} */ offset = 4 + treeType * 2;
            if ( s.bitOffset >= 16 ) {
                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                s.bitOffset -= 16;
            }
            let /** @type{number} */ blockType = readSymbol( s.blockTrees, 2 * treeType, s );
            const /** @type{number} */ result = readBlockLength( s.blockTrees, 2 * treeType + 1, s );
            if ( blockType == 1 ) {
                blockType = ringBuffers[ offset + 1 ] + 1;
            } else if ( blockType == 0 ) {
                blockType = ringBuffers[ offset ];
            } else {
                blockType -= 2;
            }
            if ( blockType >= numBlockTypes ) {
                blockType -= numBlockTypes;
            }
            ringBuffers[ offset ] = ringBuffers[ offset + 1 ];
            ringBuffers[ offset + 1 ] = blockType;
            return result;
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function decodeLiteralBlockSwitch( s ) {
            s.literalBlockLength = decodeBlockTypeAndLength( s, 0, s.numLiteralBlockTypes );
            const /** @type{number} */ literalBlockType = s.rings[ 5 ];
            s.contextMapSlice = literalBlockType << 6;
            s.literalTreeIdx = s.contextMap[ s.contextMapSlice ] & 0xFF;
            const /** @type{number} */ contextMode = s.contextModes[ literalBlockType ];
            s.contextLookupOffset1 = contextMode << 9;
            s.contextLookupOffset2 = s.contextLookupOffset1 + 256;
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function decodeCommandBlockSwitch( s ) {
            s.commandBlockLength = decodeBlockTypeAndLength( s, 1, s.numCommandBlockTypes );
            s.commandTreeIdx = s.rings[ 7 ];
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function decodeDistanceBlockSwitch( s ) {
            s.distanceBlockLength = decodeBlockTypeAndLength( s, 2, s.numDistanceBlockTypes );
            s.distContextMapSlice = s.rings[ 9 ] << 2;
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function maybeReallocateRingBuffer( s ) {
            let /** @type{number} */ newSize = s.maxRingBufferSize;
            if ( newSize > s.expectedTotalSize ) {
                const /** @type{number} */ minimalNewSize = s.expectedTotalSize;
                while ( ( newSize >> 1 ) > minimalNewSize ) {
                    newSize >>= 1;
                }
                if ( ( s.inputEnd == 0 ) && newSize < 16384 && s.maxRingBufferSize >= 16384 ) {
                    newSize = 16384;
                }
            }
            if ( newSize <= s.ringBufferSize ) {
                return;
            }
            const /** @type{number} */ ringBufferSizeWithSlack = newSize + 37;
            const /** @type{!Int8Array} */ newBuffer = new Int8Array( ringBufferSizeWithSlack );
            if ( s.ringBuffer.length != 0 ) {
                newBuffer.set( s.ringBuffer.subarray( 0, 0 + s.ringBufferSize ), 0 );
            }
            s.ringBuffer = newBuffer;
            s.ringBufferSize = newSize;
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function readNextMetablockHeader( s ) {
            if ( s.inputEnd != 0 ) {
                s.nextRunningState = 10;
                s.runningState = 12;
                return;
            }
            s.literalTreeGroup = new Int32Array( 0 );
            s.commandTreeGroup = new Int32Array( 0 );
            s.distanceTreeGroup = new Int32Array( 0 );
            if ( s.halfOffset > 2030 ) {
                doReadMoreInput( s );
            }
            decodeMetaBlockLength( s );
            if ( ( s.metaBlockLength == 0 ) && ( s.isMetadata == 0 ) ) {
                return;
            }
            if ( ( s.isUncompressed != 0 ) || ( s.isMetadata != 0 ) ) {
                jumpToByteBoundary( s );
                s.runningState = ( s.isMetadata != 0 ) ? 5 : 6;
            } else {
                s.runningState = 3;
            }
            if ( s.isMetadata != 0 ) {
                return;
            }
            s.expectedTotalSize += s.metaBlockLength;
            if ( s.expectedTotalSize > 1 << 30 ) {
                s.expectedTotalSize = 1 << 30;
            }
            if ( s.ringBufferSize < s.maxRingBufferSize ) {
                maybeReallocateRingBuffer( s );
            }
        }
        /**
        * @param {!State} s
        * @param {number} treeType
        * @param {number} numBlockTypes
        * @return {number}
        */
        function readMetablockPartition( s, treeType, numBlockTypes ) {
            let /** @type{number} */ offset = s.blockTrees[ 2 * treeType ];
            if ( numBlockTypes <= 1 ) {
                s.blockTrees[ 2 * treeType + 1 ] = offset;
                s.blockTrees[ 2 * treeType + 2 ] = offset;
                return 1 << 28;
            }
            const /** @type{number} */ blockTypeAlphabetSize = numBlockTypes + 2;
            offset += readHuffmanCode( blockTypeAlphabetSize, blockTypeAlphabetSize, s.blockTrees, 2 * treeType, s );
            s.blockTrees[ 2 * treeType + 1 ] = offset;
            const /** @type{number} */ blockLengthAlphabetSize = 26;
            offset += readHuffmanCode( blockLengthAlphabetSize, blockLengthAlphabetSize, s.blockTrees, 2 * treeType + 1, s );
            s.blockTrees[ 2 * treeType + 2 ] = offset;
            return readBlockLength( s.blockTrees, 2 * treeType + 1, s );
        }
        /**
        * @param {!State} s
        * @param {number} alphabetSizeLimit
        * @return {void}
        */
        function calculateDistanceLut( s, alphabetSizeLimit ) {
            const /** @type{!Int8Array} */ distExtraBits = s.distExtraBits;
            const /** @type{!Int32Array} */ distOffset = s.distOffset;
            const /** @type{number} */ npostfix = s.distancePostfixBits;
            const /** @type{number} */ ndirect = s.numDirectDistanceCodes;
            const /** @type{number} */ postfix = 1 << npostfix;
            let /** @type{number} */ bits = 1;
            let /** @type{number} */ half = 0;
            let /** @type{number} */ i = 16;
            for ( let /** @type{number} */ j = 0; j < ndirect; ++j ) {
                distExtraBits[ i ] = 0;
                distOffset[ i ] = j + 1;
                ++i;
            }
            while ( i < alphabetSizeLimit ) {
                const /** @type{number} */ base = ndirect + ( ( ( ( 2 + half ) << bits ) - 4 ) << npostfix ) + 1;
                for ( let /** @type{number} */ j = 0; j < postfix; ++j ) {
                    distExtraBits[ i ] = bits;
                    distOffset[ i ] = base + j;
                    ++i;
                }
                bits += half;
                half ^= 1;
            }
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function readMetablockHuffmanCodesAndContextMaps( s ) {
            s.numLiteralBlockTypes = decodeVarLenUnsignedByte( s ) + 1;
            s.literalBlockLength = readMetablockPartition( s, 0, s.numLiteralBlockTypes );
            s.numCommandBlockTypes = decodeVarLenUnsignedByte( s ) + 1;
            s.commandBlockLength = readMetablockPartition( s, 1, s.numCommandBlockTypes );
            s.numDistanceBlockTypes = decodeVarLenUnsignedByte( s ) + 1;
            s.distanceBlockLength = readMetablockPartition( s, 2, s.numDistanceBlockTypes );
            if ( s.halfOffset > 2030 ) {
                doReadMoreInput( s );
            }
            if ( s.bitOffset >= 16 ) {
                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                s.bitOffset -= 16;
            }
            s.distancePostfixBits = readFewBits( s, 2 );
            s.numDirectDistanceCodes = readFewBits( s, 4 ) << s.distancePostfixBits;
            s.contextModes = new Int8Array( s.numLiteralBlockTypes );
            for ( let /** @type{number} */ i = 0; i < s.numLiteralBlockTypes; ) {
                const /** @type{number} */ limit = min( i + 96, s.numLiteralBlockTypes );
                for ( ; i < limit; ++i ) {
                    if ( s.bitOffset >= 16 ) {
                        s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                        s.bitOffset -= 16;
                    }
                    s.contextModes[ i ] = readFewBits( s, 2 );
                }
                if ( s.halfOffset > 2030 ) {
                    doReadMoreInput( s );
                }
            }
            s.contextMap = new Int8Array( s.numLiteralBlockTypes << 6 );
            const /** @type{number} */ numLiteralTrees = decodeContextMap( s.numLiteralBlockTypes << 6, s.contextMap, s );
            s.trivialLiteralContext = 1;
            for ( let /** @type{number} */ j = 0; j < s.numLiteralBlockTypes << 6; j++ ) {
                if ( s.contextMap[ j ] != j >> 6 ) {
                    s.trivialLiteralContext = 0;
                    break;
                }
            }
            s.distContextMap = new Int8Array( s.numDistanceBlockTypes << 2 );
            const /** @type{number} */ numDistTrees = decodeContextMap( s.numDistanceBlockTypes << 2, s.distContextMap, s );
            s.literalTreeGroup = decodeHuffmanTreeGroup( 256, 256, numLiteralTrees, s );
            s.commandTreeGroup = decodeHuffmanTreeGroup( 704, 704, s.numCommandBlockTypes, s );
            let /** @type{number} */ distanceAlphabetSizeMax = calculateDistanceAlphabetSize( s.distancePostfixBits, s.numDirectDistanceCodes, 24 );
            let /** @type{number} */ distanceAlphabetSizeLimit = distanceAlphabetSizeMax;
            if ( s.isLargeWindow == 1 ) {
                distanceAlphabetSizeMax = calculateDistanceAlphabetSize( s.distancePostfixBits, s.numDirectDistanceCodes, 62 );
                distanceAlphabetSizeLimit = calculateDistanceAlphabetLimit( 0x7FFFFFFC, s.distancePostfixBits, s.numDirectDistanceCodes );
            }
            s.distanceTreeGroup = decodeHuffmanTreeGroup( distanceAlphabetSizeMax, distanceAlphabetSizeLimit, numDistTrees, s );
            calculateDistanceLut( s, distanceAlphabetSizeLimit );
            s.contextMapSlice = 0;
            s.distContextMapSlice = 0;
            s.contextLookupOffset1 = s.contextModes[ 0 ] * 512;
            s.contextLookupOffset2 = s.contextLookupOffset1 + 256;
            s.literalTreeIdx = 0;
            s.commandTreeIdx = 0;
            s.rings[ 4 ] = 1;
            s.rings[ 5 ] = 0;
            s.rings[ 6 ] = 1;
            s.rings[ 7 ] = 0;
            s.rings[ 8 ] = 1;
            s.rings[ 9 ] = 0;
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function copyUncompressedData( s ) {
            const /** @type{!Int8Array} */ ringBuffer = s.ringBuffer;
            if ( s.metaBlockLength <= 0 ) {
                reload( s );
                s.runningState = 2;
                return;
            }
            const /** @type{number} */ chunkLength = min( s.ringBufferSize - s.pos, s.metaBlockLength );
            copyRawBytes( s, ringBuffer, s.pos, chunkLength );
            s.metaBlockLength -= chunkLength;
            s.pos += chunkLength;
            if ( s.pos == s.ringBufferSize ) {
                s.nextRunningState = 6;
                s.runningState = 12;
                return;
            }
            reload( s );
            s.runningState = 2;
        }
        /**
        * @param {!State} s
        * @return {number}
        */
        function writeRingBuffer( s ) {
            const /** @type{number} */ toWrite = min( s.outputLength - s.outputUsed, s.ringBufferBytesReady - s.ringBufferBytesWritten );
            if ( toWrite != 0 ) {
                s.output.set( s.ringBuffer.subarray( s.ringBufferBytesWritten, s.ringBufferBytesWritten + toWrite ), s.outputOffset + s.outputUsed );
                s.outputUsed += toWrite;
                s.ringBufferBytesWritten += toWrite;
            }
            if ( s.outputUsed < s.outputLength ) {
                return 1;
            } else {
                return 0;
            }
        }
        /**
        * @param {number} alphabetSizeMax
        * @param {number} alphabetSizeLimit
        * @param {number} n
        * @param {!State} s
        * @return {!Int32Array}
        */
        function decodeHuffmanTreeGroup( alphabetSizeMax, alphabetSizeLimit, n, s ) {
            const /** @type{number} */ maxTableSize = MAX_HUFFMAN_TABLE_SIZE[ ( alphabetSizeLimit + 31 ) >> 5 ];
            const /** @type{!Int32Array} */ group = new Int32Array( n + n * maxTableSize );
            let /** @type{number} */ next = n;
            for ( let /** @type{number} */ i = 0; i < n; ++i ) {
                group[ i ] = next;
                next += readHuffmanCode( alphabetSizeMax, alphabetSizeLimit, group, i, s );
            }
            return group;
        }
        /**
        * @param {!State} s
        * @return {number}
        */
        function calculateFence( s ) {
            let /** @type{number} */ result = s.ringBufferSize;
            if ( s.isEager != 0 ) {
                result = min( result, s.ringBufferBytesWritten + s.outputLength - s.outputUsed );
            }
            return result;
        }
        /**
        * @param {!State} s
        * @param {number} fence
        * @return {void}
        */
        function doUseDictionary( s, fence ) {
            const /** @type{number} */ address = s.distance - s.maxDistance - 1 - s.cdTotalSize;
            if ( address < 0 ) {
                initializeCompoundDictionaryCopy( s, -address - 1, s.copyLength );
                s.runningState = 14;
            } else {
                const /** @type{!Int8Array} */ dictionaryData = /** @type{!Int8Array} */( data );
                const /** @type{number} */ wordLength = s.copyLength;
                const /** @type{number} */ shift = sizeBits[ wordLength ];
                let /** @type{number} */ offset = offsets[ wordLength ];
                const /** @type{number} */ mask = ( 1 << shift ) - 1;
                const /** @type{number} */ wordIdx = address & mask;
                const /** @type{number} */ transformIdx = address >>> shift;
                offset += wordIdx * wordLength;
                const /** @type{!Transforms} */ transforms = RFC_TRANSFORMS;
                const /** @type{number} */ len = transformDictionaryWord( s.ringBuffer, s.pos, dictionaryData, offset, wordLength, transforms, transformIdx );
                s.pos += len;
                s.metaBlockLength -= len;
                if ( s.pos >= fence ) {
                    s.nextRunningState = 4;
                    s.runningState = 12;
                    return;
                }
                s.runningState = 4;
            }
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function initializeCompoundDictionary( s ) {
            s.cdBlockMap = new Int8Array( 256 );
            let /** @type{number} */ blockBits = 8;
            while ( ( ( s.cdTotalSize - 1 ) >>> blockBits ) != 0 ) {
                blockBits++;
            }
            blockBits -= 8;
            s.cdBlockBits = blockBits;
            let /** @type{number} */ cursor = 0;
            let /** @type{number} */ index = 0;
            while ( cursor < s.cdTotalSize ) {
                while ( s.cdChunkOffsets[ index + 1 ] < cursor ) {
                    index++;
                }
                s.cdBlockMap[ cursor >>> blockBits ] = index;
                cursor += 1 << blockBits;
            }
        }
        /**
        * @param {!State} s
        * @param {number} address
        * @param {number} length
        * @return {void}
        */
        function initializeCompoundDictionaryCopy( s, address, length ) {
            if ( s.cdBlockBits == -1 ) {
                initializeCompoundDictionary( s );
            }
            let /** @type{number} */ index = s.cdBlockMap[ address >>> s.cdBlockBits ];
            while ( address >= s.cdChunkOffsets[ index + 1 ] ) {
                index++;
            }
            s.distRbIdx = ( s.distRbIdx + 1 ) & 0x3;
            s.rings[ s.distRbIdx ] = s.distance;
            s.metaBlockLength -= length;
            s.cdBrIndex = index;
            s.cdBrOffset = address - s.cdChunkOffsets[ index ];
            s.cdBrLength = length;
            s.cdBrCopied = 0;
        }
        /**
        * @param {!State} s
        * @param {number} fence
        * @return {number}
        */
        function copyFromCompoundDictionary( s, fence ) {
            let /** @type{number} */ pos = s.pos;
            const /** @type{number} */ origPos = pos;
            while ( s.cdBrLength != s.cdBrCopied ) {
                const /** @type{number} */ space = fence - pos;
                const /** @type{number} */ chunkLength = s.cdChunkOffsets[ s.cdBrIndex + 1 ] - s.cdChunkOffsets[ s.cdBrIndex ];
                const /** @type{number} */ remChunkLength = chunkLength - s.cdBrOffset;
                let /** @type{number} */ length = s.cdBrLength - s.cdBrCopied;
                if ( length > remChunkLength ) {
                    length = remChunkLength;
                }
                if ( length > space ) {
                    length = space;
                }
                copyBytes( s.ringBuffer, pos, s.cdChunks[ s.cdBrIndex ], s.cdBrOffset, s.cdBrOffset + length );
                pos += length;
                s.cdBrOffset += length;
                s.cdBrCopied += length;
                if ( length == remChunkLength ) {
                    s.cdBrIndex++;
                    s.cdBrOffset = 0;
                }
                if ( pos >= fence ) {
                    break;
                }
            }
            return pos - origPos;
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function decompress( s ) {
            if ( s.runningState == 1 ) {
                const /** @type{number} */ windowBits = decodeWindowBits( s );
                s.maxRingBufferSize = 1 << windowBits;
                s.maxBackwardDistance = s.maxRingBufferSize - 16;
                s.runningState = 2;
            }
            let /** @type{number} */ fence = calculateFence( s );
            let /** @type{number} */ ringBufferMask = s.ringBufferSize - 1;
            let /** @type{!Int8Array} */ ringBuffer = s.ringBuffer;
            while ( s.runningState != 10 ) {
                switch ( s.runningState ) {
                    case 2:
                        readNextMetablockHeader( s );
                        fence = calculateFence( s );
                        ringBufferMask = s.ringBufferSize - 1;
                        ringBuffer = s.ringBuffer;
                        continue;
                    case 3:
                        readMetablockHuffmanCodesAndContextMaps( s );
                        s.runningState = 4;
                    case 4:
                        if ( s.metaBlockLength <= 0 ) {
                            s.runningState = 2;
                            continue;
                        }
                        if ( s.halfOffset > 2030 ) {
                            doReadMoreInput( s );
                        }
                        if ( s.commandBlockLength == 0 ) {
                            decodeCommandBlockSwitch( s );
                        }
                        s.commandBlockLength--;
                        if ( s.bitOffset >= 16 ) {
                            s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                            s.bitOffset -= 16;
                        }
                        const /** @type{number} */ cmdCode = readSymbol( s.commandTreeGroup, s.commandTreeIdx, s ) << 2;
                        const /** @type{number} */ insertAndCopyExtraBits = CMD_LOOKUP[ cmdCode ];
                        const /** @type{number} */ insertLengthOffset = CMD_LOOKUP[ cmdCode + 1 ];
                        const /** @type{number} */ copyLengthOffset = CMD_LOOKUP[ cmdCode + 2 ];
                        s.distanceCode = CMD_LOOKUP[ cmdCode + 3 ];
                        if ( s.bitOffset >= 16 ) {
                            s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                            s.bitOffset -= 16;
                        }
                        const /** @type{number} */ insertLengthExtraBits = insertAndCopyExtraBits & 0xFF;
                        s.insertLength = insertLengthOffset + ( ( insertLengthExtraBits <= 16 ) ? readFewBits( s, insertLengthExtraBits ) : readManyBits( s, insertLengthExtraBits ) );
                        if ( s.bitOffset >= 16 ) {
                            s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                            s.bitOffset -= 16;
                        }
                        const /** @type{number} */ copyLengthExtraBits = insertAndCopyExtraBits >> 8;
                        s.copyLength = copyLengthOffset + ( ( copyLengthExtraBits <= 16 ) ? readFewBits( s, copyLengthExtraBits ) : readManyBits( s, copyLengthExtraBits ) );
                        s.j = 0;
                        s.runningState = 7;
                    case 7:
                        if ( s.trivialLiteralContext != 0 ) {
                            while ( s.j < s.insertLength ) {
                                if ( s.halfOffset > 2030 ) {
                                    doReadMoreInput( s );
                                }
                                if ( s.literalBlockLength == 0 ) {
                                    decodeLiteralBlockSwitch( s );
                                }
                                s.literalBlockLength--;
                                if ( s.bitOffset >= 16 ) {
                                    s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                                    s.bitOffset -= 16;
                                }
                                ringBuffer[ s.pos ] = readSymbol( s.literalTreeGroup, s.literalTreeIdx, s );
                                s.pos++;
                                s.j++;
                                if ( s.pos >= fence ) {
                                    s.nextRunningState = 7;
                                    s.runningState = 12;
                                    break;
                                }
                            }
                        } else {
                            let /** @type{number} */ prevByte1 = ringBuffer[ ( s.pos - 1 ) & ringBufferMask ] & 0xFF;
                            let /** @type{number} */ prevByte2 = ringBuffer[ ( s.pos - 2 ) & ringBufferMask ] & 0xFF;
                            while ( s.j < s.insertLength ) {
                                if ( s.halfOffset > 2030 ) {
                                    doReadMoreInput( s );
                                }
                                if ( s.literalBlockLength == 0 ) {
                                    decodeLiteralBlockSwitch( s );
                                }
                                const /** @type{number} */ literalContext = LOOKUP[ s.contextLookupOffset1 + prevByte1 ] | LOOKUP[ s.contextLookupOffset2 + prevByte2 ];
                                const /** @type{number} */ literalTreeIdx = s.contextMap[ s.contextMapSlice + literalContext ] & 0xFF;
                                s.literalBlockLength--;
                                prevByte2 = prevByte1;
                                if ( s.bitOffset >= 16 ) {
                                    s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                                    s.bitOffset -= 16;
                                }
                                prevByte1 = readSymbol( s.literalTreeGroup, literalTreeIdx, s );
                                ringBuffer[ s.pos ] = prevByte1;
                                s.pos++;
                                s.j++;
                                if ( s.pos >= fence ) {
                                    s.nextRunningState = 7;
                                    s.runningState = 12;
                                    break;
                                }
                            }
                        }
                        if ( s.runningState != 7 ) {
                            continue;
                        }
                        s.metaBlockLength -= s.insertLength;
                        if ( s.metaBlockLength <= 0 ) {
                            s.runningState = 4;
                            continue;
                        }
                        let /** @type{number} */ distanceCode = s.distanceCode;
                        if ( distanceCode < 0 ) {
                            s.distance = s.rings[ s.distRbIdx ];
                        } else {
                            if ( s.halfOffset > 2030 ) {
                                doReadMoreInput( s );
                            }
                            if ( s.distanceBlockLength == 0 ) {
                                decodeDistanceBlockSwitch( s );
                            }
                            s.distanceBlockLength--;
                            if ( s.bitOffset >= 16 ) {
                                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                                s.bitOffset -= 16;
                            }
                            const /** @type{number} */ distTreeIdx = s.distContextMap[ s.distContextMapSlice + distanceCode ] & 0xFF;
                            distanceCode = readSymbol( s.distanceTreeGroup, distTreeIdx, s );
                            if ( distanceCode < 16 ) {
                                const /** @type{number} */ index = ( s.distRbIdx + DISTANCE_SHORT_CODE_INDEX_OFFSET[ distanceCode ] ) & 0x3;
                                s.distance = s.rings[ index ] + DISTANCE_SHORT_CODE_VALUE_OFFSET[ distanceCode ];
                            } else {
                                const /** @type{number} */ extraBits = s.distExtraBits[ distanceCode ];
                                let /** @type{number} */ bits;
                                if ( s.bitOffset + extraBits <= 32 ) {
                                    bits = readFewBits( s, extraBits );
                                } else {
                                    if ( s.bitOffset >= 16 ) {
                                        s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                                        s.bitOffset -= 16;
                                    }
                                    bits = ( ( extraBits <= 16 ) ? readFewBits( s, extraBits ) : readManyBits( s, extraBits ) );
                                }
                                s.distance = s.distOffset[ distanceCode ] + ( bits << s.distancePostfixBits );
                            }
                        }
                        if ( s.maxDistance != s.maxBackwardDistance && s.pos < s.maxBackwardDistance ) {
                            s.maxDistance = s.pos;
                        } else {
                            s.maxDistance = s.maxBackwardDistance;
                        }
                        if ( s.distance > s.maxDistance ) {
                            s.runningState = 9;
                            continue;
                        }
                        if ( distanceCode > 0 ) {
                            s.distRbIdx = ( s.distRbIdx + 1 ) & 0x3;
                            s.rings[ s.distRbIdx ] = s.distance;
                        }
                        s.j = 0;
                        s.runningState = 8;
                    case 8:
                        let /** @type{number} */ src = ( s.pos - s.distance ) & ringBufferMask;
                        let /** @type{number} */ dst = s.pos;
                        const /** @type{number} */ copyLength = s.copyLength - s.j;
                        const /** @type{number} */ srcEnd = src + copyLength;
                        const /** @type{number} */ dstEnd = dst + copyLength;
                        if ( ( srcEnd < ringBufferMask ) && ( dstEnd < ringBufferMask ) ) {
                            if ( copyLength < 12 || ( srcEnd > dst && dstEnd > src ) ) {
                                for ( let /** @type{number} */ k = 0; k < copyLength; k += 4 ) {
                                    ringBuffer[ dst++ ] = ringBuffer[ src++ ];
                                    ringBuffer[ dst++ ] = ringBuffer[ src++ ];
                                    ringBuffer[ dst++ ] = ringBuffer[ src++ ];
                                    ringBuffer[ dst++ ] = ringBuffer[ src++ ];
                                }
                            } else {
                                ringBuffer.copyWithin( dst, src, srcEnd );
                            }
                            s.j += copyLength;
                            s.metaBlockLength -= copyLength;
                            s.pos += copyLength;
                        } else {
                            for ( ; s.j < s.copyLength; ) {
                                ringBuffer[ s.pos ] = ringBuffer[ ( s.pos - s.distance ) & ringBufferMask ];
                                s.metaBlockLength--;
                                s.pos++;
                                s.j++;
                                if ( s.pos >= fence ) {
                                    s.nextRunningState = 8;
                                    s.runningState = 12;
                                    break;
                                }
                            }
                        }
                        if ( s.runningState == 8 ) {
                            s.runningState = 4;
                        }
                        continue;
                    case 9:
                        doUseDictionary( s, fence );
                        continue;
                    case 14:
                        s.pos += copyFromCompoundDictionary( s, fence );
                        if ( s.pos >= fence ) {
                            s.nextRunningState = 14;
                            s.runningState = 12;
                            return;
                        }
                        s.runningState = 4;
                        continue;
                    case 5:
                        while ( s.metaBlockLength > 0 ) {
                            if ( s.halfOffset > 2030 ) {
                                doReadMoreInput( s );
                            }
                            if ( s.bitOffset >= 16 ) {
                                s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                                s.bitOffset -= 16;
                            }
                            readFewBits( s, 8 );
                            s.metaBlockLength--;
                        }
                        s.runningState = 2;
                        continue;
                    case 6:
                        copyUncompressedData( s );
                        continue;
                    case 12:
                        s.ringBufferBytesReady = min( s.pos, s.ringBufferSize );
                        s.runningState = 13;
                    case 13:
                        if ( writeRingBuffer( s ) == 0 ) {
                            return;
                        }
                        if ( s.pos >= s.maxBackwardDistance ) {
                            s.maxDistance = s.maxBackwardDistance;
                        }
                        if ( s.pos >= s.ringBufferSize ) {
                            if ( s.pos > s.ringBufferSize ) {
                                ringBuffer.copyWithin( 0, s.ringBufferSize, s.pos );
                            }
                            s.pos &= ringBufferMask;
                            s.ringBufferBytesWritten = 0;
                        }
                        s.runningState = s.nextRunningState;
                        continue;
                    default:
                        throw 'Unexpected state ' + s.runningState;
                }
            }
            if ( s.runningState == 10 ) {
                jumpToByteBoundary( s );
            }
        }

        /**
        * @constructor
        * @param {number} numTransforms
        * @param {number} prefixSuffixLen
        * @param {number} prefixSuffixCount
        * @struct
        */
        function Transforms( numTransforms, prefixSuffixLen, prefixSuffixCount ) {
            /** @type {!number} */
            this.numTransforms = 0;
            /** @type {!Int32Array} */
            this.triplets = new Int32Array( 0 );
            /** @type {!Int8Array} */
            this.prefixSuffixStorage = new Int8Array( 0 );
            /** @type {!Int32Array} */
            this.prefixSuffixHeads = new Int32Array( 0 );
            /** @type {!Int16Array} */
            this.params = new Int16Array( 0 );
            this.numTransforms = numTransforms;
            this.triplets = new Int32Array( numTransforms * 3 );
            this.params = new Int16Array( numTransforms );
            this.prefixSuffixStorage = new Int8Array( prefixSuffixLen );
            this.prefixSuffixHeads = new Int32Array( prefixSuffixCount + 1 );
        }

        /** @type {!Transforms} */
        let RFC_TRANSFORMS = new Transforms( 121, 167, 50 );
        /**
        * @param {!Int8Array} prefixSuffix
        * @param {!Int32Array} prefixSuffixHeads
        * @param {!Int32Array} transforms
        * @param {!string} prefixSuffixSrc
        * @param {!string} transformsSrc
        * @return {void}
        */
        function unpackTransforms( prefixSuffix, prefixSuffixHeads, transforms, prefixSuffixSrc, transformsSrc ) {
            const /** @type{number} */ n = prefixSuffixSrc.length;
            let /** @type{number} */ index = 1;
            let /** @type{number} */ j = 0;
            for ( let /** @type{number} */ i = 0; i < n; ++i ) {
                const /** @type{number} */ c = prefixSuffixSrc.charCodeAt( i );
                if ( c == 35 ) {
                    prefixSuffixHeads[ index++ ] = j;
                } else {
                    prefixSuffix[ j++ ] = c;
                }
            }
            for ( let /** @type{number} */ i = 0; i < 363; ++i ) {
                transforms[ i ] = transformsSrc.charCodeAt( i ) - 32;
            }
        }
        {
            unpackTransforms( RFC_TRANSFORMS.prefixSuffixStorage, RFC_TRANSFORMS.prefixSuffixHeads, RFC_TRANSFORMS.triplets, "# #s #, #e #.# the #.com/#\xC2\xA0# of # and # in # to #\"#\">#\n#]# for # a # that #. # with #'# from # by #. The # on # as # is #ing #\n\t#:#ed #(# at #ly #=\"# of the #. This #,# not #er #al #='#ful #ive #less #est #ize #ous #", "     !! ! ,  *!  &!  \" !  ) *   * -  ! # !  #!*!  +  ,$ !  -  %  .  / #   0  1 .  \"   2  3!*   4%  ! # /   5  6  7  8 0  1 &   $   9 +   :  ;  < '  !=  >  ?! 4  @ 4  2  &   A *# (   B  C& ) %  ) !*# *-% A +! *.  D! %'  & E *6  F  G% ! *A *%  H! D  I!+!  J!+   K +- *4! A  L!*4  M  N +6  O!*% +.! K *G  P +%(  ! G *D +D  Q +# *K!*G!+D!+# +G +A +4!+% +K!+4!*D!+K!*K" );
        }
        /**
        * @param {!Int8Array} dst
        * @param {number} dstOffset
        * @param {!Int8Array} src
        * @param {number} srcOffset
        * @param {number} len
        * @param {!Transforms} transforms
        * @param {number} transformIndex
        * @return {number}
        */
        function transformDictionaryWord( dst, dstOffset, src, srcOffset, len, transforms, transformIndex ) {
            let /** @type{number} */ offset = dstOffset;
            const /** @type{!Int32Array} */ triplets = transforms.triplets;
            const /** @type{!Int8Array} */ prefixSuffixStorage = transforms.prefixSuffixStorage;
            const /** @type{!Int32Array} */ prefixSuffixHeads = transforms.prefixSuffixHeads;
            const /** @type{number} */ transformOffset = 3 * transformIndex;
            const /** @type{number} */ prefixIdx = triplets[ transformOffset ];
            const /** @type{number} */ transformType = triplets[ transformOffset + 1 ];
            const /** @type{number} */ suffixIdx = triplets[ transformOffset + 2 ];
            let /** @type{number} */ prefix = prefixSuffixHeads[ prefixIdx ];
            const /** @type{number} */ prefixEnd = prefixSuffixHeads[ prefixIdx + 1 ];
            let /** @type{number} */ suffix = prefixSuffixHeads[ suffixIdx ];
            const /** @type{number} */ suffixEnd = prefixSuffixHeads[ suffixIdx + 1 ];
            let /** @type{number} */ omitFirst = transformType - 11;
            let /** @type{number} */ omitLast = transformType - 0;
            if ( omitFirst < 1 || omitFirst > 9 ) {
                omitFirst = 0;
            }
            if ( omitLast < 1 || omitLast > 9 ) {
                omitLast = 0;
            }
            while ( prefix != prefixEnd ) {
                dst[ offset++ ] = prefixSuffixStorage[ prefix++ ];
            }
            if ( omitFirst > len ) {
                omitFirst = len;
            }
            srcOffset += omitFirst;
            len -= omitFirst;
            len -= omitLast;
            let /** @type{number} */ i = len;
            while ( i > 0 ) {
                dst[ offset++ ] = 0;
                i--;
            }
            if ( transformType == 10 || transformType == 11 ) {
                let /** @type{number} */ uppercaseOffset = offset - len;
                if ( transformType == 10 ) {
                    len = 1;
                }
                while ( len > 0 ) {
                    const /** @type{number} */ c0 = dst[ uppercaseOffset ] & 0xFF;
                    if ( c0 < 0xC0 ) {
                        if ( c0 >= 97 && c0 <= 122 ) {
                            dst[ uppercaseOffset ] ^= 32;
                        }
                        uppercaseOffset += 1;
                        len -= 1;
                    } else if ( c0 < 0xE0 ) {
                        dst[ uppercaseOffset + 1 ] ^= 32;
                        uppercaseOffset += 2;
                        len -= 2;
                    } else {
                        dst[ uppercaseOffset + 2 ] ^= 5;
                        uppercaseOffset += 3;
                        len -= 3;
                    }
                }
            } else if ( transformType == 21 || transformType == 22 ) {
                let /** @type{number} */ shiftOffset = offset - len;
                const /** @type{number} */ param = transforms.params[ transformIndex ];
                let /** @type{number} */ scalar = ( param & 0x7FFF ) + ( 0x1000000 - ( param & 0x8000 ) );
                while ( len > 0 ) {
                    let /** @type{number} */ step = 1;
                    const /** @type{number} */ c0 = dst[ shiftOffset ] & 0xFF;
                    if ( c0 < 0x80 ) {
                        scalar += c0;
                        dst[ shiftOffset ] = ( scalar & 0x7F );
                    } else if ( c0 < 0xC0 ) {
                    } else if ( c0 < 0xE0 ) {
                        if ( len >= 2 ) {
                            const /** @type{number} */ c1 = dst[ shiftOffset + 1 ];
                            scalar += ( c1 & 0x3F ) | ( ( c0 & 0x1F ) << 6 );
                            dst[ shiftOffset ] = ( 0xC0 | ( ( scalar >> 6 ) & 0x1F ) );
                            dst[ shiftOffset + 1 ] = ( ( c1 & 0xC0 ) | ( scalar & 0x3F ) );
                            step = 2;
                        } else {
                            step = len;
                        }
                    } else if ( c0 < 0xF0 ) {
                        if ( len >= 3 ) {
                            const /** @type{number} */ c1 = dst[ shiftOffset + 1 ];
                            const /** @type{number} */ c2 = dst[ shiftOffset + 2 ];
                            scalar += ( c2 & 0x3F ) | ( ( c1 & 0x3F ) << 6 ) | ( ( c0 & 0x0F ) << 12 );
                            dst[ shiftOffset ] = ( 0xE0 | ( ( scalar >> 12 ) & 0x0F ) );
                            dst[ shiftOffset + 1 ] = ( ( c1 & 0xC0 ) | ( ( scalar >> 6 ) & 0x3F ) );
                            dst[ shiftOffset + 2 ] = ( ( c2 & 0xC0 ) | ( scalar & 0x3F ) );
                            step = 3;
                        } else {
                            step = len;
                        }
                    } else if ( c0 < 0xF8 ) {
                        if ( len >= 4 ) {
                            const /** @type{number} */ c1 = dst[ shiftOffset + 1 ];
                            const /** @type{number} */ c2 = dst[ shiftOffset + 2 ];
                            const /** @type{number} */ c3 = dst[ shiftOffset + 3 ];
                            scalar += ( c3 & 0x3F ) | ( ( c2 & 0x3F ) << 6 ) | ( ( c1 & 0x3F ) << 12 ) | ( ( c0 & 0x07 ) << 18 );
                            dst[ shiftOffset ] = ( 0xF0 | ( ( scalar >> 18 ) & 0x07 ) );
                            dst[ shiftOffset + 1 ] = ( ( c1 & 0xC0 ) | ( ( scalar >> 12 ) & 0x3F ) );
                            dst[ shiftOffset + 2 ] = ( ( c2 & 0xC0 ) | ( ( scalar >> 6 ) & 0x3F ) );
                            dst[ shiftOffset + 3 ] = ( ( c3 & 0xC0 ) | ( scalar & 0x3F ) );
                            step = 4;
                        } else {
                            step = len;
                        }
                    }
                    shiftOffset += step;
                    len -= step;
                    if ( transformType == 21 ) {
                        len = 0;
                    }
                }
            }
            while ( suffix != suffixEnd ) {
                dst[ offset++ ] = prefixSuffixStorage[ suffix++ ];
            }
            return offset - dstOffset;
        }

        /**
        * @param {number} key
        * @param {number} len
        * @return {number}
        */
        function getNextKey( key, len ) {
            let /** @type{number} */ step = 1 << ( len - 1 );
            while ( ( key & step ) != 0 ) {
                step >>= 1;
            }
            return ( key & ( step - 1 ) ) + step;
        }
        /**
        * @param {!Int32Array} table
        * @param {number} offset
        * @param {number} step
        * @param {number} end
        * @param {number} item
        * @return {void}
        */
        function replicateValue( table, offset, step, end, item ) {
            do {
                end -= step;
                table[ offset + end ] = item;
            } while ( end > 0 );
        }
        /**
        * @param {!Int32Array} count
        * @param {number} len
        * @param {number} rootBits
        * @return {number}
        */
        function nextTableBitSize( count, len, rootBits ) {
            let /** @type{number} */ left = 1 << ( len - rootBits );
            while ( len < 15 ) {
                left -= count[ len ];
                if ( left <= 0 ) {
                    break;
                }
                len++;
                left <<= 1;
            }
            return len - rootBits;
        }
        /**
        * @param {!Int32Array} tableGroup
        * @param {number} tableIdx
        * @param {number} rootBits
        * @param {!Int32Array} codeLengths
        * @param {number} codeLengthsSize
        * @return {number}
        */
        function buildHuffmanTable( tableGroup, tableIdx, rootBits, codeLengths, codeLengthsSize ) {
            const /** @type{number} */ tableOffset = tableGroup[ tableIdx ];
            let /** @type{number} */ key;
            const /** @type{!Int32Array} */ sorted = new Int32Array( codeLengthsSize );
            const /** @type{!Int32Array} */ count = new Int32Array( 16 );
            const /** @type{!Int32Array} */ offset = new Int32Array( 16 );
            let /** @type{number} */ symbol;
            for ( symbol = 0; symbol < codeLengthsSize; symbol++ ) {
                count[ codeLengths[ symbol ] ]++;
            }
            offset[ 1 ] = 0;
            for ( let /** @type{number} */ len = 1; len < 15; len++ ) {
                offset[ len + 1 ] = offset[ len ] + count[ len ];
            }
            for ( symbol = 0; symbol < codeLengthsSize; symbol++ ) {
                if ( codeLengths[ symbol ] != 0 ) {
                    sorted[ offset[ codeLengths[ symbol ] ]++ ] = symbol;
                }
            }
            let /** @type{number} */ tableBits = rootBits;
            let /** @type{number} */ tableSize = 1 << tableBits;
            let /** @type{number} */ totalSize = tableSize;
            if ( offset[ 15 ] == 1 ) {
                for ( key = 0; key < totalSize; key++ ) {
                    tableGroup[ tableOffset + key ] = sorted[ 0 ];
                }
                return totalSize;
            }
            key = 0;
            symbol = 0;
            for ( let /** @type{number} */ len = 1, step = 2; len <= rootBits; len++, step <<= 1 ) {
                for ( ; count[ len ] > 0; count[ len ]-- ) {
                    replicateValue( tableGroup, tableOffset + key, step, tableSize, len << 16 | sorted[ symbol++ ] );
                    key = getNextKey( key, len );
                }
            }
            const /** @type{number} */ mask = totalSize - 1;
            let /** @type{number} */ low = -1;
            let /** @type{number} */ currentOffset = tableOffset;
            for ( let /** @type{number} */ len = rootBits + 1, step = 2; len <= 15; len++, step <<= 1 ) {
                for ( ; count[ len ] > 0; count[ len ]-- ) {
                    if ( ( key & mask ) != low ) {
                        currentOffset += tableSize;
                        tableBits = nextTableBitSize( count, len, rootBits );
                        tableSize = 1 << tableBits;
                        totalSize += tableSize;
                        low = key & mask;
                        tableGroup[ tableOffset + low ] = ( tableBits + rootBits ) << 16 | ( currentOffset - tableOffset - low );
                    }
                    replicateValue( tableGroup, currentOffset + ( key >> rootBits ), step, tableSize, ( len - rootBits ) << 16 | sorted[ symbol++ ] );
                    key = getNextKey( key, len );
                }
            }
            return totalSize;
        }

        /**
        * @param {!State} s
        * @return {void}
        */
        function doReadMoreInput( s ) {
            if ( s.endOfStreamReached != 0 ) {
                if ( halfAvailable( s ) >= -2 ) {
                    return;
                }
            }
            const /** @type{number} */ readOffset = s.halfOffset << 1;
            let /** @type{number} */ bytesInBuffer = 4096 - readOffset;
            s.byteBuffer.copyWithin( 0, readOffset, 4096 );
            s.halfOffset = 0;
            while ( bytesInBuffer < 4096 ) {
                const /** @type{number} */ spaceLeft = 4096 - bytesInBuffer;
                const /** @type{number} */ len = readInput( s.input, s.byteBuffer, bytesInBuffer, spaceLeft );
                if ( len <= 0 ) {
                    s.endOfStreamReached = 1;
                    s.tailBytes = bytesInBuffer;
                    bytesInBuffer += 1;
                    break;
                }
                bytesInBuffer += len;
            }
            bytesToNibbles( s, bytesInBuffer );
        }
        /**
        * @param {!State} s
        * @param {number} n
        * @return {number}
        */
        function readFewBits( s, n ) {
            const /** @type{number} */ val = ( s.accumulator32 >>> s.bitOffset ) & ( ( 1 << n ) - 1 );
            s.bitOffset += n;
            return val;
        }
        /**
        * @param {!State} s
        * @param {number} n
        * @return {number}
        */
        function readManyBits( s, n ) {
            const /** @type{number} */ low = readFewBits( s, 16 );
            s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
            s.bitOffset -= 16;
            return low | ( readFewBits( s, n - 16 ) << 16 );
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function initBitReader( s ) {
            s.byteBuffer = new Int8Array( 4160 );
            s.accumulator32 = 0;
            s.shortBuffer = new Int16Array( 2080 );
            s.bitOffset = 32;
            s.halfOffset = 2048;
            s.endOfStreamReached = 0;
            prepare( s );
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function prepare( s ) {
            if ( s.halfOffset > 2030 ) {
                doReadMoreInput( s );
            }
            s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
            s.bitOffset -= 16;
            s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
            s.bitOffset -= 16;
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function reload( s ) {
            if ( s.bitOffset == 32 ) {
                prepare( s );
            }
        }
        /**
        * @param {!State} s
        * @return {void}
        */
        function jumpToByteBoundary( s ) {
            const /** @type{number} */ padding = ( 32 - s.bitOffset ) & 7;
            if ( padding != 0 ) {
                readFewBits( s, padding );
            }
        }
        /**
        * @param {!State} s
        * @return {number}
        */
        function halfAvailable( s ) {
            let /** @type{number} */ limit = 2048;
            if ( s.endOfStreamReached != 0 ) {
                limit = ( s.tailBytes + 1 ) >> 1;
            }
            return limit - s.halfOffset;
        }
        /**
        * @param {!State} s
        * @param {!Int8Array} data
        * @param {number} offset
        * @param {number} length
        * @return {void}
        */
        function copyRawBytes( s, data, offset, length ) {
            while ( ( s.bitOffset != 32 ) && ( length != 0 ) ) {
                data[ offset++ ] = ( s.accumulator32 >>> s.bitOffset );
                s.bitOffset += 8;
                length--;
            }
            if ( length == 0 ) {
                return;
            }
            const /** @type{number} */ copyNibbles = min( halfAvailable( s ), length >> 1 );
            if ( copyNibbles > 0 ) {
                const /** @type{number} */ readOffset = s.halfOffset << 1;
                const /** @type{number} */ delta = copyNibbles << 1;
                data.set( s.byteBuffer.subarray( readOffset, readOffset + delta ), offset );
                offset += delta;
                length -= delta;
                s.halfOffset += copyNibbles;
            }
            if ( length == 0 ) {
                return;
            }
            if ( halfAvailable( s ) > 0 ) {
                if ( s.bitOffset >= 16 ) {
                    s.accumulator32 = ( s.shortBuffer[ s.halfOffset++ ] << 16 ) | ( s.accumulator32 >>> 16 );
                    s.bitOffset -= 16;
                }
                while ( length != 0 ) {
                    data[ offset++ ] = ( s.accumulator32 >>> s.bitOffset );
                    s.bitOffset += 8;
                    length--;
                }
                return;
            }
            while ( length > 0 ) {
                const /** @type{number} */ len = readInput( s.input, data, offset, length );
                offset += len;
                length -= len;
            }
        }
        /**
        * @param {!State} s
        * @param {number} byteLen
        * @return {void}
        */
        function bytesToNibbles( s, byteLen ) {
            const /** @type{!Int8Array} */ byteBuffer = s.byteBuffer;
            const /** @type{number} */ halfLen = byteLen >> 1;
            const /** @type{!Int16Array} */ shortBuffer = s.shortBuffer;
            for ( let /** @type{number} */ i = 0; i < halfLen; ++i ) {
                shortBuffer[ i ] = ( ( byteBuffer[ i * 2 ] & 0xFF ) | ( ( byteBuffer[ ( i * 2 ) + 1 ] & 0xFF ) << 8 ) );
            }
        }

        /** @type {!Int32Array} */
        let LOOKUP = new Int32Array( 2048 );
        /**
        * @param {!Int32Array} lookup
        * @param {!string} map
        * @param {!string} rle
        * @return {void}
        */
        function unpackLookupTable( lookup, map, rle ) {
            for ( let /** @type{number} */ i = 0; i < 256; ++i ) {
                lookup[ i ] = i & 0x3F;
                lookup[ 512 + i ] = i >> 2;
                lookup[ 1792 + i ] = 2 + ( i >> 6 );
            }
            for ( let /** @type{number} */ i = 0; i < 128; ++i ) {
                lookup[ 1024 + i ] = 4 * ( map.charCodeAt( i ) - 32 );
            }
            for ( let /** @type{number} */ i = 0; i < 64; ++i ) {
                lookup[ 1152 + i ] = i & 1;
                lookup[ 1216 + i ] = 2 + ( i & 1 );
            }
            let /** @type{number} */ offset = 1280;
            for ( let /** @type{number} */ k = 0; k < 19; ++k ) {
                const /** @type{number} */ value = k & 3;
                const /** @type{number} */ rep = rle.charCodeAt( k ) - 32;
                for ( let /** @type{number} */ i = 0; i < rep; ++i ) {
                    lookup[ offset++ ] = value;
                }
            }
            for ( let /** @type{number} */ i = 0; i < 16; ++i ) {
                lookup[ 1792 + i ] = 1;
                lookup[ 2032 + i ] = 6;
            }
            lookup[ 1792 ] = 0;
            lookup[ 2047 ] = 7;
            for ( let /** @type{number} */ i = 0; i < 256; ++i ) {
                lookup[ 1536 + i ] = lookup[ 1792 + i ] << 3;
            }
        }
        {
            unpackLookupTable( LOOKUP, "         !!  !                  \"#$##%#$&'##(#)#++++++++++((&*'##,---,---,-----,-----,-----&#'###.///.///./////./////./////&#'# ", "A/*  ':  & : $  \x81 @" );
        }

        /**
        * @constructor
        * @struct
        */
        function State() {
            /** @type {!Int8Array} */
            this.ringBuffer = new Int8Array( 0 );
            /** @type {!Int8Array} */
            this.contextModes = new Int8Array( 0 );
            /** @type {!Int8Array} */
            this.contextMap = new Int8Array( 0 );
            /** @type {!Int8Array} */
            this.distContextMap = new Int8Array( 0 );
            /** @type {!Int8Array} */
            this.distExtraBits = new Int8Array( 0 );
            /** @type {!Int8Array} */
            this.output = new Int8Array( 0 );
            /** @type {!Int8Array} */
            this.byteBuffer = new Int8Array( 0 );
            /** @type {!Int16Array} */
            this.shortBuffer = new Int16Array( 0 );
            /** @type {!Int32Array} */
            this.intBuffer = new Int32Array( 0 );
            /** @type {!Int32Array} */
            this.rings = new Int32Array( 0 );
            /** @type {!Int32Array} */
            this.blockTrees = new Int32Array( 0 );
            /** @type {!Int32Array} */
            this.literalTreeGroup = new Int32Array( 0 );
            /** @type {!Int32Array} */
            this.commandTreeGroup = new Int32Array( 0 );
            /** @type {!Int32Array} */
            this.distanceTreeGroup = new Int32Array( 0 );
            /** @type {!Int32Array} */
            this.distOffset = new Int32Array( 0 );
            /** @type {!number} */
            this.runningState = 0;
            /** @type {!number} */
            this.nextRunningState = 0;
            /** @type {!number} */
            this.accumulator32 = 0;
            /** @type {!number} */
            this.bitOffset = 0;
            /** @type {!number} */
            this.halfOffset = 0;
            /** @type {!number} */
            this.tailBytes = 0;
            /** @type {!number} */
            this.endOfStreamReached = 0;
            /** @type {!number} */
            this.metaBlockLength = 0;
            /** @type {!number} */
            this.inputEnd = 0;
            /** @type {!number} */
            this.isUncompressed = 0;
            /** @type {!number} */
            this.isMetadata = 0;
            /** @type {!number} */
            this.literalBlockLength = 0;
            /** @type {!number} */
            this.numLiteralBlockTypes = 0;
            /** @type {!number} */
            this.commandBlockLength = 0;
            /** @type {!number} */
            this.numCommandBlockTypes = 0;
            /** @type {!number} */
            this.distanceBlockLength = 0;
            /** @type {!number} */
            this.numDistanceBlockTypes = 0;
            /** @type {!number} */
            this.pos = 0;
            /** @type {!number} */
            this.maxDistance = 0;
            /** @type {!number} */
            this.distRbIdx = 0;
            /** @type {!number} */
            this.trivialLiteralContext = 0;
            /** @type {!number} */
            this.literalTreeIdx = 0;
            /** @type {!number} */
            this.commandTreeIdx = 0;
            /** @type {!number} */
            this.j = 0;
            /** @type {!number} */
            this.insertLength = 0;
            /** @type {!number} */
            this.contextMapSlice = 0;
            /** @type {!number} */
            this.distContextMapSlice = 0;
            /** @type {!number} */
            this.contextLookupOffset1 = 0;
            /** @type {!number} */
            this.contextLookupOffset2 = 0;
            /** @type {!number} */
            this.distanceCode = 0;
            /** @type {!number} */
            this.numDirectDistanceCodes = 0;
            /** @type {!number} */
            this.distancePostfixBits = 0;
            /** @type {!number} */
            this.distance = 0;
            /** @type {!number} */
            this.copyLength = 0;
            /** @type {!number} */
            this.maxBackwardDistance = 0;
            /** @type {!number} */
            this.maxRingBufferSize = 0;
            /** @type {!number} */
            this.ringBufferSize = 0;
            /** @type {!number} */
            this.expectedTotalSize = 0;
            /** @type {!number} */
            this.outputOffset = 0;
            /** @type {!number} */
            this.outputLength = 0;
            /** @type {!number} */
            this.outputUsed = 0;
            /** @type {!number} */
            this.ringBufferBytesWritten = 0;
            /** @type {!number} */
            this.ringBufferBytesReady = 0;
            /** @type {!number} */
            this.isEager = 0;
            /** @type {!number} */
            this.isLargeWindow = 0;
            /** @type {!number} */
            this.cdNumChunks = 0;
            /** @type {!number} */
            this.cdTotalSize = 0;
            /** @type {!number} */
            this.cdBrIndex = 0;
            /** @type {!number} */
            this.cdBrOffset = 0;
            /** @type {!number} */
            this.cdBrLength = 0;
            /** @type {!number} */
            this.cdBrCopied = 0;
            /** @type {!Array} */
            this.cdChunks = new Array( 0 );
            /** @type {!Int32Array} */
            this.cdChunkOffsets = new Int32Array( 0 );
            /** @type {!number} */
            this.cdBlockBits = 0;
            /** @type {!Int8Array} */
            this.cdBlockMap = new Int8Array( 0 );
            /** @type {!InputStream|null} */
            this.input = null;
            this.ringBuffer = new Int8Array( 0 );
            this.rings = new Int32Array( 10 );
            this.rings[ 0 ] = 16;
            this.rings[ 1 ] = 15;
            this.rings[ 2 ] = 11;
            this.rings[ 3 ] = 4;
        }

        /** @type {!Int8Array|null} */
        let data = null;
        /** @type {!Int32Array} */
        let offsets = new Int32Array( 32 );
        /** @type {!Int32Array} */
        let sizeBits = new Int32Array( 32 );
        /**
        * @param {!Int32Array} newSizeBits
        * @return {void}
        */
        function setData( newSizeBits ) {
            const /** @type{!Int32Array} */ dictionaryOffsets = offsets;
            const /** @type{!Int32Array} */ dictionarySizeBits = sizeBits;
            dictionarySizeBits.set( newSizeBits.subarray( 0, 0 + newSizeBits.length ), 0 );
            let /** @type{number} */ pos = 0;
            for ( let /** @type{number} */ i = 0; i < newSizeBits.length; ++i ) {
                dictionaryOffsets[ i ] = pos;
                const /** @type{number} */ bits = dictionarySizeBits[ i ];
                if ( bits != 0 ) {
                    pos += i << bits;
                }
            }
            for ( let /** @type{number} */ i = newSizeBits.length; i < 32; ++i ) {
                dictionaryOffsets[ i ] = pos;
            }
        }

        {
            const /** @type {!string} */ sizeBitsData = 'AAAAKKLLKKKKKJJIHHIHHGGFF';
            const /** @type{!Int32Array} */ dictionarySizeBits = new Int32Array( 25 );
            for ( let /** @type{number} */ i = 0; i < sizeBitsData.length; ++i ) {
                dictionarySizeBits[ i ] = sizeBitsData.charCodeAt( i ) - 65;
            }
            setData( dictionarySizeBits );
        }

        /* GENERATED CODE END */

        /**
        * @param {!number} a
        * @param {!number} b
        * @return {!number}
        */
        function min( a, b ) {
            return a <= b ? a : b;
        }

        /**
        * @param {!Int8Array} dst
        * @param {!number} target
        * @param {!Int8Array} src
        * @param {!number} start
        * @param {!number} end
        * @return {void}
        */
        function copyBytes( dst, target, src, start, end ) {
            dst.set( src.slice( start, end ), target );
        }

        /**
        * @param {!InputStream|null} src
        * @param {!Int8Array} dst
        * @param {!number} offset
        * @param {!number} length
        * @return {!number}
        */
        function readInput( src, dst, offset, length ) {
            if ( src == null ) {
                return -1;
            }
            const /** number */ end = min( src.offset + length, src.data.length );
            const /** number */ bytesRead = end - src.offset;
            dst.set( src.data.subarray( src.offset, end ), offset );
            src.offset += bytesRead;
            return bytesRead;
        }

        /**
        * @param {!InputStream} src
        * @return {!number}
        */
        function closeInput( src ) {
            return 0;
        }

        /**
        * @param {!Int8Array} src
        * @return {!Int8Array}
        */
        function asReadOnlyBuffer( src ) {
            return src;
        }

        /**
        * @param {!Int8Array} src
        * @return {!number}
        */
        function isReadOnly( src ) {
            return 1;
        }

        /**
        * @param {!Int8Array} src
        * @return {!number}
        */
        function isDirect( src ) {
            return 1;
        }

        /**
        * @param {!Int8Array} buffer
        * @return {void}
        */
        function flipBuffer( buffer ) { /* no-op */ }

        /**
        * @param {!string} src
        * @return {!Int8Array}
        */
        function toUsAsciiBytes( src ) {
            const /** !number */ n = src.length;
            const /** !Int8Array */ result = new Int8Array( n );
            for ( let /** !number */ i = 0; i < n; ++i ) {
                result[ i ] = src.charCodeAt( i );
            }
            return result;
        }

        /**
        * @param {!Int8Array} bytes
        * @return {!Int8Array}
        */
        function decode( bytes ) {
            const /** !State */ s = new State();
            initState( s, new InputStream( bytes ) );
            let /** !number */ totalOutput = 0;
            const /** !Array<!Int8Array> */ chunks = [];
            while ( true ) {
                const /** !Int8Array */ chunk = new Int8Array( 16384 );
                chunks.push( chunk );
                s.output = chunk;
                s.outputOffset = 0;
                s.outputLength = 16384;
                s.outputUsed = 0;
                decompress( s );
                totalOutput += s.outputUsed;
                if ( s.outputUsed < 16384 ) {
                    break;
                }
            }
            close( s );
            const /** !Int8Array */ result = new Int8Array( totalOutput );
            let /** !number */ offset = 0;
            for ( let /** !number */ i = 0; i < chunks.length; ++i ) {
                const /** !Int8Array */ chunk = chunks[ i ];
                const /** !number */ end = min( totalOutput, offset + 16384 );
                const /** !number */ len = end - offset;
                if ( len < 16384 ) {
                    result.set( chunk.subarray( 0, len ), offset );
                } else {
                    result.set( chunk, offset );
                }
                offset += len;
            }
            return result;
        }

        return decode;
    };

    /**
      * @type {function(!Int8Array):!Int8Array}
      */
    window['makeBrotliDecode'] = makeBrotliDecode;
}
