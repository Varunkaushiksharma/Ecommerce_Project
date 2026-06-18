import java.util.*;

public class Trys {
    public static void main(String[] args){
        // Deque<Integer> stack = new ArrayDeque<>();
        // int[] arr = {2,3,1,4,5};
        // ArrayList<Integer> list = new ArrayList<>();
        // stack.push(arr[arr.length-1]);
        // for(int i = arr.length-2;i>=0;i--){
        //     if(stack.peek()>arr[i]){
        //         list.add(stack.peek());
        //         stack.push(arr[i]);
        //     }else{
        //         while(!stack.isEmpty() && stack.peek()<=arr[i]){
        //             stack.pop();
        //         }
        //         if(stack.isEmpty()){
        //             list.add(-1);
        //         }else{
        //             list.add(stack.peek());
        //         }
        //         stack.push(arr[i]);
        //     }
        // }
        // Collections.reverse(list);
        // System.out.println(list);

        System.out.println(new BCryptPasswordEncoder().encode("admin123"));
    }
}
