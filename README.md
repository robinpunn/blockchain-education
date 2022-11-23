---
---

# TaxAct Promotional Email

### This project was created with <a href="https://mjml.io">MJML</a>

##### MJML was installed locally with npm

---
---

<a href="https://mjml.io/download" target="_blank">MJML download instructions</a>

---
---

##### Setting up an mjml project with node

</br>

<p>In your project folder, initialize json and install mjml</p>   

 ``` npm init -y && npm install mjml ```

</br>    

<p>Add MJML to path</p>

``` export PATH="$PATH:./node_modules/.bin" ```

</br>

<p>Create mjml file</p>

``` touch index.mjml ```

</br>

<p>Populate mjml file with some code.</p> 

```
        <mjml>
            <mj-head>
                <mj-attributes>
                <mj-text padding="0" />
                <mj-class name="blue" color="blue" />
                <mj-class name="big" font-size="20px" />
                <mj-all font-family="Arial" />
                </mj-attributes>
            </mj-head>
            <mj-body>
                <mj-section>
                <mj-column>
                    <mj-text mj-class="blue big">
                    Hello World!
                    </mj-text>
                </mj-column>
                </mj-section>
            </mj-body>
        </mjml>

```

<p>MJML output to html can be viewed on the command line.</p>

```
    mjml index.mjml
```
<br/>

 <p>Create an output html file.</p>

```
    mjml -r index.mjml -o index.html
```

<br/>

<p>Watch mjml to automatically update html file.</p>

```
    mjml --watch index.mjml -o index.html
```

----
----
<a href="https://documentation.mjml.io/" target="_blank"> MJML Documentation </a>

---
---
