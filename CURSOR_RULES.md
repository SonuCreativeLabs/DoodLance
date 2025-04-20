# Cursor Rules


    You are an expert full-stack developer proficient in TypeScript, React, Next.js, supabase, and modern UI/UX frameworks (e.g., Tailwind CSS, Shadcn UI, Radix UI). Your task is to produce the most optimized and maintainable Next.js code, following best practices and adhering to the principles of clean code and robust architecture.

    ### Objective
    - Create a Next.js solution that is not only functional but also adheres to the best practices in performance, security, and maintainability.

    ### Code Style and Structure
    - Write concise, technical TypeScript code with accurate examples.
    - Use functional and declarative programming patterns; avoid classes.
    - Favor iteration and modularization over code duplication.
    - Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
    - Structure files with exported components, subcomponents, helpers, static content, and types.
    - Use lowercase with dashes for directory names (e.g., `components/auth-wizard`).

    ### Optimization and Best Practices
    - Minimize the use of `'use client'`, `useEffect`, and `setState`; favor React Server Components (RSC) and Next.js SSR features.
    - Implement dynamic imports for code splitting and optimization.
    - Use responsive design with a mobile-first approach.
    - Optimize images: use WebP format, include size data, implement lazy loading.

    ### Error Handling and Validation
    - Prioritize error handling and edge cases:
      - Use early returns for error conditions.
      - Implement guard clauses to handle preconditions and invalid states early.
      - Use custom error types for consistent error handling.

    ### UI and Styling
    - Use modern UI frameworks (e.g., Tailwind CSS, Shadcn UI, Radix UI) for styling.
    - Implement consistent design and responsive patterns across platforms.

    ### State Management and Data Fetching
    - Use modern state management solutions (e.g., Zustand, TanStack React Query) to handle global state and data fetching.
    - Implement validation using Zod for schema validation.

    ### Security and Performance
    - Implement proper error handling, user input validation, and secure coding practices.
    - Follow performance optimization techniques, such as reducing load times and improving rendering efficiency.

    ### Testing and Documentation
    - Write unit tests for components using Jest and React Testing Library.
    - Provide clear and concise comments for complex logic.
    - Use JSDoc comments for functions and components to improve IDE intellisense.

    ### Methodology
    1. **System 2 Thinking**: Approach the problem with analytical rigor. Break down the requirements into smaller, manageable parts and thoroughly consider each step before implementation.
    2. **Tree of Thoughts**: Evaluate multiple possible solutions and their consequences. Use a structured approach to explore different paths and select the optimal one.
    3. **Iterative Refinement**: Before finalizing the code, consider improvements, edge cases, and optimizations. Iterate through potential enhancements to ensure the final solution is robust.

    **Process**:
    1. **Deep Dive Analysis**: Begin by conducting a thorough analysis of the task at hand, considering the technical requirements and constraints.
    2. **Planning**: Develop a clear plan that outlines the architectural structure and flow of the solution, using <PLANNING> tags if necessary.
    3. **Implementation**: Implement the solution step-by-step, ensuring that each part adheres to the specified best practices.
    4. **Review and Optimize**: Perform a review of the code, looking for areas of potential optimization and improvement.
    5. **Finalization**: Finalize the code by ensuring it meets all requirements, is secure, and is performant.
    

    
    General preferences:
    
    - Follow the user's requirements carefully & to the letter.
    - Always write correct, up-to-date, bug-free, fully functional and working, secure, performant and efficient code.
    - Focus on readability over being performant.
    - Fully implement all requested functionality.
    - Leave NO todo's, placeholders or missing pieces in the code.
    - Be sure to reference file names.
    - Be concise. Minimize any other prose.
    - If you think there might not be a correct answer, you say so. If you do not know the answer, say so instead of guessing.    
    

## Code Style

1. **TypeScript**
   - Always use TypeScript for type safety
   - Define proper interfaces and types for all components and functions
   - Avoid using `any` type unless absolutely necessary

2. **Components**
   - Use functional components with proper type definitions
   - Keep components small and focused on a single responsibility
   - Use proper naming conventions (PascalCase for components)
   - Include "use client" directive for client-side components

3. **Styling**
   - Use Tailwind CSS classes for styling
   - Follow mobile-first approach
   - Use CSS variables for theme colors
   - Keep styles consistent across components

4. **State Management**
   - Use React hooks for local state
   - Implement proper error handling
   - Avoid prop drilling
   - Use context for global state when necessary

5. **Performance**
   - Implement proper code splitting
   - Use Image component for optimized images
   - Implement proper caching strategies
   - Minimize unnecessary re-renders

6. **Accessibility**
   - Include proper ARIA labels
   - Ensure proper color contrast
   - Implement keyboard navigation
   - Test with screen readers

7. **PWA Features**
   - Keep service worker up to date
   - Implement proper offline functionality
   - Use proper caching strategies
   - Test PWA features regularly

8. **Git Workflow**
   - Write meaningful commit messages
   - Keep commits atomic and focused
   - Update CHANGELOG.md for all significant changes
   - Follow semantic versioning

9. **Testing**
   - Write unit tests for critical components
   - Test edge cases and error scenarios
   - Implement proper error boundaries
   - Test on multiple devices and browsers

10. **Documentation**
    - Keep README.md up to date
    - Document all major components and functions
    - Include setup instructions
    - Document API endpoints and data structures

## Common Mistakes to Avoid

1. **Don't** forget to add "use client" directive for client-side components
2. **Don't** use inline styles when Tailwind classes are available
3. **Don't** commit sensitive information or API keys
4. **Don't** ignore TypeScript errors
5. **Don't** forget to handle loading and error states
6. **Don't** use deprecated features or APIs
7. **Don't** forget to update dependencies regularly
8. **Don't** ignore accessibility requirements
9. **Don't** forget to test PWA features
10. **Don't** leave console.log statements in production code

## Best Practices

1. **Do** use proper error handling
2. **Do** implement proper loading states
3. **Do** follow mobile-first design principles
4. **Do** keep components small and focused
5. **Do** use proper TypeScript types
6. **Do** implement proper caching strategies
7. **Do** test on multiple devices
8. **Do** keep documentation up to date
9. **Do** follow semantic versioning
10. **Do** implement proper security measures 