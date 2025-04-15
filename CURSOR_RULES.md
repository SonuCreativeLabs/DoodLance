# Cursor Rules

This document outlines the rules and best practices to follow when working with the SkilledMice project.

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