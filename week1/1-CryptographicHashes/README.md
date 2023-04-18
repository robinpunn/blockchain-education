### Cryptographic Hashes
----

### Find Favorite Color
#### Brute Force Hashing
1. Cryptographic Hash Functions like SHA256 are one-way functions. This means that if you have the input, it's relatively trivial to find the output.   
    - On the other hand, if you have the output, it is infeasible to find the input.
2. However, if you knew the hashes of some common inputs, then you could brute-force guess at the output or create a [Rainbow Table](https://university.alchemy.com/course/ethereum/sc/6317afca5216a46480f65674/stage/6317afca5216a46480f65677?tab=details) to determine what that input is.

#### Rainbow Table
1. A rainbow table is simply a table which maps common inputs to their hash output. For instance, we could map common passwords to their SHA256 hashes:

    <table>
        <tr>
            <th>Common Passwords</th>
            <th>SHA256 HASH<tr>
        </tr>
        <tr>
            <td>password</td>
            <td>0x5e8848...1542d8<td>
        </tr>
        <tr>
            <td>qwerty</td>
            <td>0x65e84b...2337c5<td>
        </tr>
        <tr>
            <td>111111</td>
            <td>0xbcb15f...09802a<td>
        </tr>
        <tr>
            <td>12345678</td>
            <td>0xef797c...98a64f<td>
        </tr>
        <tr>
            <td>abc123</td>
            <td>0x6ca13d...118090<td>
        </tr>
    </table>

    - Even though the password should be unguessable, given a hash output, these common passwords make it easy to create a rainbow table to find what the plaintext input would be.

#### Your Goal: Find the Color
- Given a SHA256 hash, find the color input that would generate that hash.
    - You can assume that all the hashes be generated only from colors provided in the COLORS array.
1. To take the hash of a color, first use ``utf8ToBytes`` to translate the string to bytes. Then, use ``sha256`` to hash it.
1. When you want to compare two hashes, first use toHex to turn each hash from a Uint8Array to a string of hexadecimal characters.
- So comparing two hashes would look like this:
    ```js
    const a = "apple";
    const b = "banana";

    const aBytes = utf8ToBytes(a);
    const bBytes = utf8ToBytes(b);

    const aHash = sha256(aBytes);
    const bHash = sha256(bBytes);

    console.log(toHex(aHash) === toHex(aHash)); // true
    console.log(toHex(aHash) === toHex(bHash)); // false
    ```
>  Wondering what utf8 stands for? The UTF-8 standard translates all the possible keyboard characters you can think of into bytes. This is an agreed upon standard to ensure we all get the same bit values representing the letters and words we see on the screen. Learn more about [utf8 here](https://en.wikipedia.org/wiki/UTF-8).

```js
const { sha256 } = require("ethereum-cryptography/sha256");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

// the possible colors that the hash could represent
const COLORS = ['red', 'green', 'blue', 'yellow', 'pink', 'orange'];

// given a hash, return the color that created the hash
function findColor(hash) {
    return COLORS.filter(color => toHex(sha256(utf8ToBytes(color))) === toHex(hash))
}

module.exports = findColor;
```