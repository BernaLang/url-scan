## URL Scan

### Executar
1 - instalar as dependências:
``npm install`` OU ``npm i``
2- Executar o programa:
``npm run start `` OU ``npm run start <url>``
ex: 
``npm run start https://google.pt``

### Testes
Para correr os testes unitários ([mocha](https://mochajs.org/)):
``npm run test``

### Output
O programa devolve um JSON, em cli e no ficheiro ``output.json`` na raiz do projeto.
O JSON contém as seguintes keys:

- treeDepth
	- JSON com a tag com a maior profundidade na árvore de HTML, e os parentes, ex:
```
{
	"tag":  "a",
	"depth":  11,
	"parents":  [ "li", "ul", "li", "ul", "div", "div", "div", "nav", "div", "body", "html"]
}
```
- elementCount
	-  JSON com tags HTML da página e o número de vezes que essa tag existe, ex: 
```
{ 
	html: 1, 
	body: 1, 
	div: 5 
}
```
- attributesCount
	- JSON que contém as tags HTML, os atributos de cada tipo de tag e quantas vezes esse atributo existe na página nessa tag, ex:
```
{ 
	div: {
		id: 2,
		class: 5
	}, 
	body: {
		class: 1
	}
}
```
- childrenCount
	- JSON que contém as tags HTML que têm filhos, com o número de filhos total, o nome do elemento dos mesmos e quantas vezes cada um existe, ex:
```
{
	"html":  {
		"childrenCount":  2,
		"children":  {
			"head":  1,
			"body":  1
		}
	},
	"head":  {
	"childrenCount":  32,
	"children":  {
		"title":  1,
		"meta":  10,
		"link":  17,
		"script":  4
	},
	"body":  {
		"childrenCount":  13,
		"children":  {
			"div":  1,
			"script":  12
		}
	},
	...
}
```
- loadedResources
	- Array de JSON's que contém cada recurso carregado na página e informação do mesmo, ex:
```
[
	{
		path: "//cdn.com/js/jquery.js",
		absolutePath: "https://cdn.com/js/jquery.js",
		tagName: "script",
		file: "jquery.js",
		fileExtension: ".js",
		additionalInfo: {
			fileType: "application/javascript; charset=UTF-8"
		}
	},
	{
		path: "/assets/img/logo.png",
		absolutePath: "https://website.com/assets/img/logo.png",
		tagName: "img",
		file: "logo.png",
		fileExtension: ".png",
		additionalInfo:  {
			fileSize:  "3050",
			fileType:  "image/png",
			lastModified:  "Mon, 09 Apr 2018 10:06:16 GMT"
		}
	},
]
```

> NOTA: o campo "fileSize" é em Bytes

