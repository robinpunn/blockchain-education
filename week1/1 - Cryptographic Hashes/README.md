### Cryptographic Hashes
----

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