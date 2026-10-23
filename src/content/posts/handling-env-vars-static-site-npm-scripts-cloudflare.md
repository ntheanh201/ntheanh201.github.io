---
title: "Handling environment variables when Deploying a Static Site with NPM Scripts and Cloudflare Pages"
description: "However, when deploying with Cloudflare Pages, this approach can lead to errors such as:"
date: 2025-05-02
tags: ["cloudflare"]
cover: "/img/d80c9fbd071a2ccc81285732d94f69d718cab03d.jpg"
---

## **Problem**

-   When deploying a static site with NPM scripts that utilize bash commands and environment variables inside `package.json` scripts, you might define something like:

```json
  "scripts": {
    "transpile-js": ". .env; for file in "\${JS_FILES[@]}"; do(babel js/"\$file".js -o dist/js/"\$file".js --presets=@babel/preset-env); done"
  }
```

However, when deploying with Cloudflare Pages, this approach can lead to errors such as:

![](/img/0cb8b545ee0e0074d338fd98727cdb8dcb35197d.png)

## **Solution**

-   Set the environment variables in the Cloudflare Pages dashboard. 
    
    ![](/img/783600eaa50536dafadb7d635f59f01db8f217b8.png)
    
-   Use **dotenvx** to preload environment variables instead of using the .env file, as Cloudflare doesn't support .env files.
    
    ```json
      "scripts": {
        "transpile-js": "dotenvx run -- bash -c 'read -r -a JS_FILES <<< "$JS_FILES"; for file in "${JS_FILES[@]}"; do(babel js/$file.js -o dist/js/$file.js --presets=@babel/preset-env); done'"
      }
    ```
    

For a complete example, you can check out the code: **[https://github.com/ntheanh201/cloudflare-static-site](https://github.com/ntheanh201/cloudflare-static-site)**

## **Result**

-   The error is gone and the deployment is successful.
