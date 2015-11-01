# Decorators in typescript

@source http://stackoverflow.com/a/29837695

## General Points

* Decorators are called when the class is declared—not when an object is instantiated.
* Multiple decorators can be defined on the same Class/Property/Method/Parameter.
* Decorators are not allowed on constructors.

### A valid decorator should be:

1. Assignable to one of the Decorator types (`ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator`).
2. Return a value (in the case of class decorators and method decorator) that is assignable to the decorated value.

## Method / Formal Accessor Decorator

Implementation parameters:

`target`: The prototype of the class (`Object`).  
`propertyKey`: The name of the method (`string | symbol`).  
`descriptor`: A `TypedPropertyDescriptor` — If you're unfamiliar with a descriptor's keys,
I would recommend reading about it in this documentation on `Object.defineProperty` (it's the third parameter).

**Example - Without Arguments**

Use:

```javascript
class MyClass {
    @log
    myMethod(arg: string) { 
        return "Message -- " + arg;
    }
}
```

Implementation:

```javascript
function log(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    var originalMethod = descriptor.value; // save a reference to the original method

    // NOTE: Do not use arrow syntax here. Use a function expression in 
    // order to use the correct value of `this` in this method (see notes below)
    descriptor.value = function(...args: any[]) {
        console.log("The method args are: " + JSON.stringify(args)); // pre
        var result = originalMethod.apply(this, args);               // run and store the result
        console.log("The return value is: " + result);               // post
        return result;                                               // return the result of the original method
    };

    return descriptor;
}
```

Input:

```javascript
new MyClass().myMethod("testing");
```

Output:

    The method args are: ["testing"]
    The return value is: Message -- testing

Notes:

* Do not use arrow syntax when setting the descriptor's value. 
  [The context of `this` will not be the instance's if you do.](http://stackoverflow.com/q/30329832/188246)
* It's better to modify the original descriptor than overwriting the current one by returning a new descriptor. 
  This allows you to use multiple decorators that edit the descriptor without overwriting
  what another decorator did.
  Doing this allows you to use something like `@enumerable(false)` and `@log` at the same time 
  (Example: 
  [Bad](http://www.typescriptlang.org/Playground/#src=class%20FooBar%20%7B%0D%0A%20%20%20%20%40log%0D%0A%09%40enumerable(false)%0D%0A%20%20%20%20public%20foo(arg)%3A%20void%20%7B%0D%0A%09%09%2F%2F%20this%20code%20will%20incorrectly%20output%20%22foo%22%20because%20the%20log%20decorator%20OVERWRITES%20the%20descriptor%0D%0A%20%20%20%20%20%20%20%20for%20(var%20prop%20in%20this)%20%7B%0D%0A%09%09%09console.log(prop)%3B%0D%0A%09%09%7D%0D%0A%20%20%20%20%7D%0D%0A%7D%0D%0A%0D%0Afunction%20log(target%3A%20Object%2C%20propertyKey%3A%20string%2C%20value%3A%20TypedPropertyDescriptor%3Cany%3E)%20%7B%0D%0A%09return%20%7B%0D%0A%20%20%20%20%20%20%20%20value%3A%20function%20(...args%3A%20any%5B%5D)%20%7B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20a%20%3D%20args.map(a%20%3D%3E%20JSON.stringify(a)).join()%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20result%20%3D%20value.value.apply(this%2C%20args)%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20var%20r%20%3D%20JSON.stringify(result)%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20console.log(%60Call%3A%20%24%7BpropertyKey%7D(%24%7Ba%7D)%20%3D%3E%20%24%7Br%7D%60)%3B%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20result%3B%0D%0A%20%20%20%20%20%20%20%20%7D%0D%0A%20%20%20%20%7D%3B%0D%0A%7D%0D%0A%0D%0Afunction%20enumerable(isEnumerable%3A%20boolean)%20%7B%0D%0A%20%20%20%20return%20(target%3A%20Object%2C%20propertyKey%3A%20string%2C%20descriptor%3A%20TypedPropertyDescriptor%3Cany%3E)%20%3D%3E%20%7B%0D%0A%20%20%20%20%20%20%20%20descriptor.enumerable%20%3D%20isEnumerable%3B%0D%0A%20%20%20%20%20%20%20%20return%20descriptor%3B%0D%0A%20%20%20%20%7D%0D%0A%7D%0D%0A%0D%0Avar%20test%20%3D%20new%20FooBar()%3B%0D%0A%0D%0Atest.foo(%22asdf%22)%3B) 
  vs 
  [Good](http://www.typescriptlang.org/Playground/#src=class%20FooBar%20%7B%0D%0A%20%20%20%20%40log%0D%0A%09%40enumerable(false)%0D%0A%20%20%20%20public%20foo(arg)%3A%20void%20%7B%0D%0A%09%09%2F%2F%20this%20code%20will%20correctly%20NOT%20output%20%22foo%22%20because%20the%20log%20decorator%20MODIFIES%20the%20descriptor%0D%0A%20%20%20%20%20%20%20%20for%20(var%20prop%20in%20this)%20%7B%0D%0A%09%09%09console.log(prop)%3B%0D%0A%09%09%7D%0D%0A%20%20%20%20%7D%0D%0A%7D%0D%0A%0D%0Afunction%20log(target%3A%20Object%2C%20propertyKey%3A%20string%2C%20value%3A%20TypedPropertyDescriptor%3Cany%3E)%20%7B%0D%0A%09var%20originalMethod%20%3D%20value.value%3B%0D%0A%09%0D%0A%20%20%20%20value.value%20%3D%20function%20(...args%3A%20any%5B%5D)%20%7B%0D%0A%09%09var%20a%20%3D%20args.map(a%20%3D%3E%20JSON.stringify(a)).join()%3B%0D%0A%09%09var%20result%20%3D%20originalMethod.apply(this%2C%20args)%3B%0D%0A%09%09var%20r%20%3D%20JSON.stringify(result)%3B%0D%0A%09%09console.log(%60Call%3A%20%24%7BpropertyKey%7D(%24%7Ba%7D)%20%3D%3E%20%24%7Br%7D%60)%3B%0D%0A%09%09return%20result%3B%0D%0A%09%7D%3B%0D%0A%20%20%20%20%0D%0A%09return%20value%3B%0D%0A%7D%0D%0A%0D%0Afunction%20enumerable(isEnumerable%3A%20boolean)%20%7B%0D%0A%20%20%20%20return%20(target%3A%20Object%2C%20propertyKey%3A%20string%2C%20descriptor%3A%20TypedPropertyDescriptor%3Cany%3E)%20%3D%3E%20%7B%0D%0A%20%20%20%20%20%20%20%20descriptor.enumerable%20%3D%20isEnumerable%3B%0D%0A%20%20%20%20%20%20%20%20return%20descriptor%3B%0D%0A%20%20%20%20%7D%0D%0A%7D%0D%0A%0D%0Avar%20test%20%3D%20new%20FooBar()%3B%0D%0A%0D%0Atest.foo(%22asdf%22)%3B))
* The generic part of the descriptor parameter's type (`TypedPropertyDescriptor<any>`)
  can be used to restrict what function types the decorator can be put on. ([Example](http://www.typescriptlang.org/Playground/#src=class%20MyClass%20%7B%0D%0A%20%20%20%20%40numberOnly%20%2F%2F%20error%0D%0A%20%20%20%20myMethod(arg%3A%20string)%20%7B%20%0D%0A%20%20%20%20%20%20%20%20return%20%22Message%20--%20%22%20%2B%20arg%3B%0D%0A%20%20%20%20%7D%0D%0A%09%0D%0A%09%40numberOnly%20%2F%2F%20ok%0D%0A%09myNumberMethod(num%3A%20number)%20%7B%0D%0A%09%09return%20num%3B%0D%0A%09%7D%0D%0A%7D%0D%0A%0D%0Afunction%20numberOnly(target%3A%20Object%2C%20propertyKey%3A%20string%2C%20descriptor%3A%20TypedPropertyDescriptor%3C(num%3A%20number)%20%3D%3E%20number%3E)%20%7B%0D%0A%09console.log('This%20descriptor%20is%20only%20allowed%20on%20methods%20that%20have%20one%20parameter%20of%20type%20number%20and%20return%20a%20number.')%3B%0D%0A%20%20%20%20return%20descriptor%3B%0D%0A%7D))