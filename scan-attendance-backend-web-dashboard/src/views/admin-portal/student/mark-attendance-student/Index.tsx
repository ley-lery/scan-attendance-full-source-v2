import { Radio, RadioGroup } from "@heroui/react"
import FullSessions from "./FullSessions"
import OneSession from "./OneSession"
import { useState } from "react"

const Index = () => {
  const [value, setValue] = useState("one")
  return (
    <div>
      <div className="h-[calc(100%-100px)] p-4">
        <div className="flex items-center justify-center pb-10">
          <RadioGroup defaultValue="one"  value={value} onChange={(e) => setValue(e.target.value)}>
            <div className="flex items-center gap-2">
              <Radio value="one">One Session</Radio>
              <Radio value="full">Full Sessions</Radio>
            </div>
          </RadioGroup>
        </div>
        {value === "full" ? <FullSessions /> : <OneSession />}
      </div>
    </div>
  )
}

export default Index