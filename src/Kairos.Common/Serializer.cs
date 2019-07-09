using System;
using Newtonsoft.Json;

namespace Kairos.Common
{
    public interface ISerializer
    {
        string Serialize<T>(T obj);
        T Deserialize<T>(string json);
        object Deserialize(Type type, string json);
    }

    public class Serializer : ISerializer
    {
        public string Serialize<T>(T obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public T Deserialize<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }

        public object Deserialize(Type type, string json)
        {
            return JsonConvert.DeserializeObject(json, type);
        }
    }
}