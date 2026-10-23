---
title: "UI package: Gather user feedback in your React apps"
description: "I spent the weekend diving into publish an npm package that I'm thrilled to introduce: react-user-feedback. If you're a React/FE developer, you know the importance of collecting…"
date: 2024-02-04
tags: ["react"]
---

I spent the weekend diving into publish an npm package that I'm thrilled to introduce: react-user-feedback. If you're a React/FE developer, you know the importance of collecting user feedback to continually improve your applications.

![](/img/5b5fb210df1dfb1d6be187680aa2dfc8ca8b6e7d.png)

react-user-feedback is an npm package I created that provides a `<UserFeedback/>` React UI component powered by the dynamic combination of TailwindCSS, shadcn/ui, zod and react-hook-form.

Now it’s time to get started:

1\. Install the NPM package

```bash
npm install @ntheanh201/react-user-feedback
```

1.  Import the component and stylesheet
    
    You can render the component globally or have the component be scoped to a specific page.
    

```ts
import UserFeedback from "@ntheanh201/react-user-feedback";

// tailwindcss, shadcn/ui
import "@ntheanh201/react-user-feedback/dist/styles.css";

function App() {
  return (
        <UserFeedback
          disabled={false}
          allowImage={true}
          feedbackTypes={[
            { value: "general", label: "General" },
            { value: "bug", label: "Bug" },
            { value: "idea", label: "Idea" },
          ]}
          onSubmit={(values, onError) => {
            console.log("values: ", values);
          }}
        />
  );
}
```

1.  **Collect valuable feedback**
    
    That's it! One more step that you need to send the feedback to your server and you're ready to gather user feedback efficiently and effectively in your React application.
    
    Enjoy the benefits of react-user-feedback and elevate your development process.
    

I created it to solve a personal problem as a hobby developer. I hope you find the package helpful. If you wanna contribute to this package, check: [https://github.com/ntheanh201/react-user-feedback#contributing](https://github.com/ntheanh201/react-user-feedback#contributing)

Happy coding!
